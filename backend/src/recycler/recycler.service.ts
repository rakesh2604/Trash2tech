import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogService } from '../audit/audit-log.service';
import { DomainError } from '../common/domain-error';
import { PickupStatus } from '../entities/pickup.entity';
import { LotDispatch, LotPickup, LotStatus, RecyclerIntake } from '../entities/lot.entity';
import { Lot } from '../entities/lot.entity';
import { Pickup } from '../entities/pickup.entity';
import { Recycler } from '../entities/reference.entity';
import { User } from '../entities/user.entity';
import { assertPickupTransition } from '../pickups/pickup-state';
import { ConfirmRecyclerIntakeDto } from './dto/confirm-intake.dto';
import { AnomaliesService } from '../anomalies/anomalies.service';
import { AnomalySeverity, AnomalyType } from '../entities/anomaly.entity';

function toNumber(value: string): number {
  const n = Number(value);
  if (!Number.isFinite(n))
    throw new DomainError('INVALID_NUMBER', 'Invalid numeric value', { value });
  return n;
}

@Injectable()
export class RecyclerService {
  constructor(
    @InjectRepository(RecyclerIntake)
    private readonly intakeRepo: Repository<RecyclerIntake>,
    @InjectRepository(Lot) private readonly lotRepo: Repository<Lot>,
    @InjectRepository(Recycler) private readonly recyclerRepo: Repository<Recycler>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(LotDispatch)
    private readonly dispatchRepo: Repository<LotDispatch>,
    @InjectRepository(LotPickup)
    private readonly lotPickupRepo: Repository<LotPickup>,
    @InjectRepository(Pickup)
    private readonly pickupRepo: Repository<Pickup>,
    private readonly auditLogService: AuditLogService,
    private readonly anomaliesService: AnomaliesService,
  ) {}

  async confirmIntake(dto: ConfirmRecyclerIntakeDto) {
    const [lot, recycler, confirmer] = await Promise.all([
      this.lotRepo.findOne({
        where: { id: dto.lotId },
        relations: { recycler: true },
      }),
      this.recyclerRepo.findOne({ where: { id: dto.recyclerId } }),
      this.userRepo.findOne({ where: { id: dto.confirmedByUserId } }),
    ]);

    if (!lot) throw new DomainError('LOT_NOT_FOUND', 'Lot not found', { lotId: dto.lotId });
    if (!recycler)
      throw new DomainError('RECYCLER_NOT_FOUND', 'Recycler not found', {
        recyclerId: dto.recyclerId,
      });
    if (!confirmer)
      throw new DomainError('USER_NOT_FOUND', 'User not found', { userId: dto.confirmedByUserId });
    if (lot.recycler.id !== recycler.id) {
      throw new DomainError('LOT_RECYCLER_MISMATCH', 'Lot does not belong to recycler', {
        lotRecyclerId: lot.recycler.id,
        recyclerId: recycler.id,
      });
    }

    const lastDispatch = await this.dispatchRepo.findOne({
      where: { lot: { id: lot.id } },
      order: { dispatchTime: 'DESC' },
    });
    if (!lastDispatch) {
      throw new DomainError('LOT_NOT_DISPATCHED', 'Lot has no dispatch record', { lotId: lot.id });
    }

    const receivedWeight = toNumber(dto.receivedWeightKg);
    const dispatchWeight = toNumber(lastDispatch.dispatchWeightKg);
    const variance = receivedWeight - dispatchWeight;
    const variancePct = dispatchWeight === 0 ? 0 : Math.abs(variance) / dispatchWeight;
    const thresholdPct = Number(process.env.WEIGHT_VARIANCE_THRESHOLD_PCT ?? 0.05) || 0.05;

    const intake = this.intakeRepo.create({
      lot,
      recycler,
      receivedWeightKg: dto.receivedWeightKg,
      receivedTime: new Date(dto.receivedTime),
      weightVarianceKg: variance.toFixed(3),
      varianceReason: dto.varianceReason,
      assayReportUrl: dto.assayReportUrl ?? null,
      confirmedBy: confirmer,
    });
    const saved = await this.intakeRepo.save(intake);

    lot.status = LotStatus.RECEIVED_AT_RECYCLER;
    await this.lotRepo.save(lot);

    // Update pickups: LOT_DISPATCHED → RECYCLED
    const lotPickups = await this.lotPickupRepo.find({
      where: { lot: { id: lot.id } },
      relations: { pickup: true },
    });
    for (const lp of lotPickups) {
      assertPickupTransition(lp.pickup.status, PickupStatus.RECYCLED);
      lp.pickup.status = PickupStatus.RECYCLED;
      await this.pickupRepo.save(lp.pickup);
      await this.auditLogService.append({
        entityType: 'pickup',
        entityId: lp.pickup.id,
        createdByUserId: confirmer.id,
        data: {
          action: 'PICKUP_RECYCLED',
          pickupId: lp.pickup.id,
          lotId: lot.id,
          recyclerIntakeId: saved.id,
        },
      });
    }

    await this.auditLogService.append({
      entityType: 'lot',
      entityId: lot.id,
      createdByUserId: confirmer.id,
      data: {
        action: 'RECYCLER_INTAKE_CONFIRMED',
        lotId: lot.id,
        recyclerId: recycler.id,
        dispatchWeightKg: lastDispatch.dispatchWeightKg,
        receivedWeightKg: dto.receivedWeightKg,
        weightVarianceKg: variance.toFixed(3),
        weightVariancePct: Number((variancePct * 100).toFixed(2)),
        varianceReason: dto.varianceReason,
        intakeId: saved.id,
      },
    });

    if (variancePct > thresholdPct) {
      const severity =
        variancePct > thresholdPct * 2 ? AnomalySeverity.HIGH : AnomalySeverity.MEDIUM;

      await this.anomaliesService.create({
        entityType: 'lot',
        entityId: lot.id,
        type: AnomalyType.WEIGHT_VARIANCE,
        severity,
        payload: {
          lotId: lot.id,
          lotCode: lot.lotCode,
          dispatchWeightKg: lastDispatch.dispatchWeightKg,
          receivedWeightKg: dto.receivedWeightKg,
          varianceKg: variance.toFixed(3),
          variancePct: Number((variancePct * 100).toFixed(2)),
          thresholdPct: Number((thresholdPct * 100).toFixed(2)),
          varianceReason: dto.varianceReason,
          recyclerId: recycler.id,
        },
      });

      await this.auditLogService.append({
        entityType: 'lot',
        entityId: lot.id,
        createdByUserId: confirmer.id,
        data: {
          action: 'WEIGHT_ANOMALY_FLAGGED',
          lotId: lot.id,
          varianceKg: variance.toFixed(3),
          variancePct: Number((variancePct * 100).toFixed(2)),
          thresholdPct: Number((thresholdPct * 100).toFixed(2)),
        },
      });
    }

    return saved;
  }
}
