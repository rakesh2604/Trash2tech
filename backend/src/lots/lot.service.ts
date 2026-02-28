import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AuditLogService } from '../audit/audit-log.service';
import { DomainError } from '../common/domain-error';
import { PickupStatus } from '../entities/pickup.entity';
import { HubIntakeRecord, Lot, LotDispatch, LotPickup, LotStatus } from '../entities/lot.entity';
import { Pickup } from '../entities/pickup.entity';
import { Hub, Kabadi, MaterialCategory, Recycler } from '../entities/reference.entity';
import { User } from '../entities/user.entity';
import { assertPickupTransition } from '../pickups/pickup-state';
import { RecordHubIntakeDto } from './dto/record-hub-intake.dto';
import { CreateLotDto } from './dto/create-lot.dto';
import { DispatchLotDto } from './dto/dispatch-lot.dto';

@Injectable()
export class LotService {
  constructor(
    @InjectRepository(HubIntakeRecord)
    private readonly intakeRepo: Repository<HubIntakeRecord>,
    @InjectRepository(Lot) private readonly lotRepo: Repository<Lot>,
    @InjectRepository(LotPickup) private readonly lotPickupRepo: Repository<LotPickup>,
    @InjectRepository(LotDispatch) private readonly lotDispatchRepo: Repository<LotDispatch>,
    @InjectRepository(Pickup) private readonly pickupRepo: Repository<Pickup>,
    @InjectRepository(Hub) private readonly hubRepo: Repository<Hub>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Kabadi) private readonly kabadiRepo: Repository<Kabadi>,
    @InjectRepository(MaterialCategory)
    private readonly categoryRepo: Repository<MaterialCategory>,
    @InjectRepository(Recycler)
    private readonly recyclerRepo: Repository<Recycler>,
    private readonly auditLogService: AuditLogService,
  ) {}

  private async generateLotCode(materialCategoryId: string): Promise<string> {
    const year = new Date().getFullYear();
    const suffix = Math.floor(Math.random() * 100_000)
      .toString()
      .padStart(5, '0');
    return `LOT-${materialCategoryId.slice(0, 4).toUpperCase()}-${year}-${suffix}`;
  }

  async listAvailableHubIntakes(hubId: string) {
    return await this.intakeRepo
      .createQueryBuilder('intake')
      .where('intake.hub_id = :hubId', { hubId })
      .andWhere('intake.id NOT IN (SELECT hub_intake_record_id FROM lot_pickups)')
      .orderBy('intake.weighed_at', 'DESC')
      .select(['intake.id', 'intake.weighedAt', 'intake.hubWeightKg'])
      .getMany();
  }

  async recordHubIntake(dto: RecordHubIntakeDto) {
    const [pickup, hub, captain, category] = await Promise.all([
      this.pickupRepo.findOne({ where: { id: dto.pickupId }, relations: { hub: true } }),
      this.hubRepo.findOne({ where: { id: dto.hubId } }),
      this.userRepo.findOne({ where: { id: dto.fieldCaptainUserId } }),
      this.categoryRepo.findOne({ where: { id: dto.materialCategoryId } }),
    ]);

    if (!pickup)
      throw new DomainError('PICKUP_NOT_FOUND', 'Pickup not found', { pickupId: dto.pickupId });
    if (!hub) throw new DomainError('HUB_NOT_FOUND', 'Hub not found', { hubId: dto.hubId });
    if (!captain)
      throw new DomainError('CAPTAIN_NOT_FOUND', 'Field captain not found', {
        fieldCaptainUserId: dto.fieldCaptainUserId,
      });
    if (!category)
      throw new DomainError('CATEGORY_NOT_FOUND', 'Material category not found', {
        materialCategoryId: dto.materialCategoryId,
      });

    if (pickup.hub.id !== hub.id) {
      throw new DomainError('PICKUP_HUB_MISMATCH', 'Pickup does not belong to hub', {
        pickupHubId: pickup.hub.id,
        hubId: hub.id,
      });
    }

    // Transition pickup → WEIGHED, with guard
    assertPickupTransition(pickup.status, PickupStatus.WEIGHED);
    pickup.status = PickupStatus.WEIGHED;
    await this.pickupRepo.save(pickup);

    const intake = this.intakeRepo.create({
      pickup,
      hub,
      fieldCaptain: captain,
      kabadi: dto.kabadiId ? await this.kabadiRepo.findOne({ where: { id: dto.kabadiId } }) : null,
      weighedAt: new Date(dto.weighedAt),
      materialCategory: category,
      hubWeightKg: dto.hubWeightKg,
      photoUrl: dto.photoUrl,
      geoPoint: dto.geoPoint ?? null,
      remarks: dto.remarks ?? null,
    });

    const saved = await this.intakeRepo.save(intake);

    await this.auditLogService.append({
      entityType: 'pickup',
      entityId: pickup.id,
      createdByUserId: captain.id,
      data: {
        action: 'HUB_INTAKE_RECORDED',
        pickupId: pickup.id,
        hubId: hub.id,
        hubIntakeRecordId: saved.id,
        hubWeightKg: saved.hubWeightKg,
        materialCategoryId: category.id,
        photoUrl: saved.photoUrl,
      },
    });

    return saved;
  }

  async createLot(dto: CreateLotDto, createdByUserId?: string | null) {
    const [hub, recycler, category] = await Promise.all([
      this.hubRepo.findOne({ where: { id: dto.hubId } }),
      this.recyclerRepo.findOne({ where: { id: dto.recyclerId } }),
      this.categoryRepo.findOne({ where: { id: dto.materialCategoryId } }),
    ]);

    if (!hub) throw new DomainError('HUB_NOT_FOUND', 'Hub not found', { hubId: dto.hubId });
    if (!recycler)
      throw new DomainError('RECYCLER_NOT_FOUND', 'Recycler not found', {
        recyclerId: dto.recyclerId,
      });
    if (!category)
      throw new DomainError('CATEGORY_NOT_FOUND', 'Material category not found', {
        materialCategoryId: dto.materialCategoryId,
      });

    const intakes = await this.intakeRepo.find({
      where: { id: In(dto.hubIntakeRecordIds) },
      relations: { pickup: true, hub: true, materialCategory: true },
    });

    if (intakes.length !== dto.hubIntakeRecordIds.length) {
      throw new DomainError('HUB_INTAKE_NOT_FOUND', 'One or more intake records not found', {
        expected: dto.hubIntakeRecordIds.length,
        found: intakes.length,
      });
    }

    for (const intake of intakes) {
      if (intake.hub.id !== hub.id) {
        throw new DomainError('LOT_INTAKE_HUB_MISMATCH', 'Intake record hub mismatch', {
          hubId: hub.id,
          intakeHubId: intake.hub.id,
          hubIntakeRecordId: intake.id,
        });
      }
      if (intake.materialCategory.id !== category.id) {
        throw new DomainError('LOT_INTAKE_CATEGORY_MISMATCH', 'Intake record category mismatch', {
          materialCategoryId: category.id,
          intakeCategoryId: intake.materialCategory.id,
          hubIntakeRecordId: intake.id,
        });
      }
    }

    const lot = this.lotRepo.create({
      lotCode: await this.generateLotCode(category.id),
      hub,
      recycler,
      materialCategory: category,
      status: dto.status ?? LotStatus.CREATED,
    });

    const savedLot = await this.lotRepo.save(lot);

    for (const intake of intakes) {
      // Pickup transition: WEIGHED → IN_LOT
      assertPickupTransition(intake.pickup.status, PickupStatus.IN_LOT);
      intake.pickup.status = PickupStatus.IN_LOT;
      await this.pickupRepo.save(intake.pickup);

      await this.lotPickupRepo.save(
        this.lotPickupRepo.create({
          lot: savedLot,
          hubIntakeRecord: intake,
          pickup: intake.pickup,
        }),
      );

      await this.auditLogService.append({
        entityType: 'pickup',
        entityId: intake.pickup.id,
        createdByUserId,
        data: {
          action: 'PICKUP_LINKED_TO_LOT',
          pickupId: intake.pickup.id,
          lotId: savedLot.id,
          lotCode: savedLot.lotCode,
          hubIntakeRecordId: intake.id,
        },
      });
    }

    await this.auditLogService.append({
      entityType: 'lot',
      entityId: savedLot.id,
      createdByUserId,
      data: {
        action: 'LOT_CREATED',
        lotId: savedLot.id,
        lotCode: savedLot.lotCode,
        hubId: hub.id,
        recyclerId: recycler.id,
        materialCategoryId: category.id,
        intakeCount: intakes.length,
      },
    });

    return savedLot;
  }

  async dispatchLot(lotId: string, dto: DispatchLotDto) {
    const lot = await this.lotRepo.findOne({
      where: { id: lotId },
      relations: { hub: true, recycler: true, materialCategory: true },
    });
    if (!lot) throw new DomainError('LOT_NOT_FOUND', 'Lot not found', { lotId });

    if (![LotStatus.CREATED, LotStatus.READY_FOR_DISPATCH].includes(lot.status)) {
      throw new DomainError('LOT_INVALID_STATUS', 'Lot cannot be dispatched in current status', {
        status: lot.status,
      });
    }

    lot.status = LotStatus.IN_TRANSIT;
    await this.lotRepo.save(lot);

    const dispatch = this.lotDispatchRepo.create({
      lot,
      vehicleNumber: dto.vehicleNumber,
      driverName: dto.driverName,
      dispatchWeightKg: dto.dispatchWeightKg,
      dispatchTime: new Date(dto.dispatchTime),
      dispatchDocsUrl: dto.dispatchDocsUrl ?? null,
    });
    const savedDispatch = await this.lotDispatchRepo.save(dispatch);

    // Update pickups: IN_LOT → LOT_DISPATCHED
    const lotPickups = await this.lotPickupRepo.find({
      where: { lot: { id: lot.id } },
      relations: { pickup: true },
    });
    for (const lp of lotPickups) {
      assertPickupTransition(lp.pickup.status, PickupStatus.LOT_DISPATCHED);
      lp.pickup.status = PickupStatus.LOT_DISPATCHED;
      await this.pickupRepo.save(lp.pickup);

      await this.auditLogService.append({
        entityType: 'pickup',
        entityId: lp.pickup.id,
        createdByUserId: dto.updatedByUserId ?? null,
        data: {
          action: 'PICKUP_LOT_DISPATCHED',
          pickupId: lp.pickup.id,
          lotId: lot.id,
          lotCode: lot.lotCode,
          dispatchId: savedDispatch.id,
        },
      });
    }

    await this.auditLogService.append({
      entityType: 'lot',
      entityId: lot.id,
      createdByUserId: dto.updatedByUserId ?? null,
      data: {
        action: 'LOT_DISPATCHED',
        lotId: lot.id,
        lotCode: lot.lotCode,
        dispatchId: savedDispatch.id,
        dispatchWeightKg: savedDispatch.dispatchWeightKg,
        vehicleNumber: savedDispatch.vehicleNumber,
      },
    });

    return { lot, dispatch: savedDispatch };
  }

  async getLotById(lotId: string) {
    const lot = await this.lotRepo.findOne({
      where: { id: lotId },
      relations: { hub: true, recycler: true, materialCategory: true, lotPickups: true },
    });
    if (!lot) throw new DomainError('LOT_NOT_FOUND', 'Lot not found', { lotId });
    return lot;
  }

  async listLots(params: {
    hubId?: string;
    recyclerId?: string;
    status?: LotStatus;
    limit?: number;
  }) {
    const take = Math.min(Math.max(params.limit ?? 50, 1), 200);
    const where: Record<string, unknown> = {};
    if (params.hubId) where.hub = { id: params.hubId };
    if (params.recyclerId) where.recycler = { id: params.recyclerId };
    if (params.status) where.status = params.status;

    return await this.lotRepo.find({
      where,
      relations: { hub: true, recycler: true, materialCategory: true },
      order: { createdAt: 'DESC' },
      take,
    });
  }
}
