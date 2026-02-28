import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DomainError } from '../common/domain-error';
import { AuditLogService } from '../audit/audit-log.service';
import { Citizen, CitizenType } from '../entities/citizen.entity';
import { Address } from '../entities/address.entity';
import { Pickup, PickupItem, PickupSourceChannel, PickupStatus } from '../entities/pickup.entity';
import { Hub, MaterialCategory } from '../entities/reference.entity';
import { CitizenSellRequest, SellRequestStatus } from '../entities/citizen-sell-request.entity';
import { assertPickupTransition } from './pickup-state';
import { CreatePickupDto } from './dto/create-pickup.dto';
import { PickupRepository } from './pickup.repository';

@Injectable()
export class PickupService {
  constructor(
    private readonly pickupRepository: PickupRepository,
    @InjectRepository(Hub) private readonly hubRepo: Repository<Hub>,
    @InjectRepository(MaterialCategory)
    private readonly categoryRepo: Repository<MaterialCategory>,
    @InjectRepository(CitizenSellRequest)
    private readonly sellRequestRepo: Repository<CitizenSellRequest>,
    @InjectRepository(PickupItem) private readonly pickupItemRepo: Repository<PickupItem>,
    private readonly auditLogService: AuditLogService,
  ) {}

  private async generatePickupCode(): Promise<string> {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1_000_000)
      .toString()
      .padStart(6, '0');
    return `EW-${year}-${random}`;
  }

  async createPickup(dto: CreatePickupDto, createdByUserId?: string | null) {
    const hub = await this.hubRepo.findOne({ where: { id: dto.hubId } });
    if (!hub) {
      throw new DomainError('HUB_NOT_FOUND', 'Hub not found', { hubId: dto.hubId });
    }

    const citizen = new Citizen();
    citizen.type = dto.citizenType as CitizenType;
    citizen.name = dto.citizenName ?? null;
    citizen.whatsappPhone =
      dto.sourceChannel === PickupSourceChannel.WHATSAPP ? (dto.citizenPhone ?? null) : null;
    citizen.ivrPhone =
      dto.sourceChannel === PickupSourceChannel.IVR ? (dto.citizenPhone ?? null) : null;

    const savedCitizen = await this.pickupRepository.saveCitizen(citizen);

    const address = new Address();
    address.citizen = savedCitizen;
    address.line1 = dto.address.line1;
    address.line2 = dto.address.line2 ?? null;
    address.landmark = dto.address.landmark ?? null;
    address.city = dto.address.city;
    address.state = dto.address.state;
    address.pincode = dto.address.pincode;
    address.isPrimary = true;

    const savedAddress = await this.pickupRepository.saveAddress(address);

    const pickup = new Pickup();
    pickup.pickupCode = await this.generatePickupCode();
    pickup.citizen = savedCitizen;
    pickup.address = savedAddress;
    pickup.hub = hub;
    pickup.sourceChannel = dto.sourceChannel;
    pickup.status = PickupStatus.NEW;
    pickup.notes = dto.notes ?? null;

    if (dto.primaryCategoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: dto.primaryCategoryId },
      });
      if (!category) {
        throw new DomainError('CATEGORY_NOT_FOUND', 'Material category not found', {
          primaryCategoryId: dto.primaryCategoryId,
        });
      }
      pickup.primaryCategory = category;
    } else {
      pickup.primaryCategory = null;
    }

    const savedPickup = await this.pickupRepository.savePickup(pickup);

    await this.auditLogService.append({
      entityType: 'pickup',
      entityId: savedPickup.id,
      createdByUserId,
      data: {
        action: 'PICKUP_CREATED',
        pickupId: savedPickup.id,
        pickupCode: savedPickup.pickupCode,
        status: savedPickup.status,
        hubId: hub.id,
        sourceChannel: savedPickup.sourceChannel,
      },
    });

    return savedPickup;
  }

  async updateStatus(pickupId: string, status: PickupStatus, updatedByUserId?: string | null) {
    const pickup = await this.pickupRepository.findPickupById(pickupId);
    if (!pickup) {
      throw new DomainError('PICKUP_NOT_FOUND', 'Pickup not found', { pickupId });
    }

    assertPickupTransition(pickup.status, status);
    const prev = pickup.status;
    pickup.status = status;

    const saved = await this.pickupRepository.savePickup(pickup);

    await this.auditLogService.append({
      entityType: 'pickup',
      entityId: saved.id,
      createdByUserId: updatedByUserId,
      data: {
        action: 'PICKUP_STATUS_UPDATED',
        pickupId: saved.id,
        from: prev,
        to: status,
      },
    });

    const statusToSellRequest: Partial<Record<PickupStatus, SellRequestStatus>> = {
      [PickupStatus.IN_COLLECTION]: SellRequestStatus.COLLECTED,
      [PickupStatus.AT_HUB]: SellRequestStatus.AT_HUB,
      [PickupStatus.WEIGHED]: SellRequestStatus.WEIGHED,
      [PickupStatus.IN_LOT]: SellRequestStatus.IN_LOT,
      [PickupStatus.RECYCLED]: SellRequestStatus.RECYCLED,
      [PickupStatus.CANCELLED]: SellRequestStatus.CANCELLED,
    };
    const srStatus = statusToSellRequest[status];
    if (srStatus) {
      const sr = await this.sellRequestRepo.findOne({ where: { pickup: { id: saved.id } } });
      if (sr) {
        sr.status = srStatus;
        await this.sellRequestRepo.save(sr);
      }
    }

    return saved;
  }

  async getPickupById(pickupId: string) {
    const pickup = await this.pickupRepository.findPickupById(pickupId);
    if (!pickup) {
      throw new DomainError('PICKUP_NOT_FOUND', 'Pickup not found', { pickupId });
    }
    return pickup;
  }

  async listPickups(params: { hubId?: string; status?: PickupStatus; limit?: number }) {
    return await this.pickupRepository.listPickups(params);
  }

  async createPickupFromSellRequest(
    sellRequestId: string,
    hubId: string,
    createdByUserId?: string | null,
  ) {
    const sellRequest = await this.sellRequestRepo.findOne({
      where: { id: sellRequestId },
      relations: { citizen: true, address: true, items: { materialCategory: true } },
    });
    if (!sellRequest) {
      throw new DomainError('SELL_REQUEST_NOT_FOUND', 'Sell request not found', { sellRequestId });
    }
    if (sellRequest.status !== SellRequestStatus.OPEN) {
      throw new DomainError(
        'SELL_REQUEST_NOT_OPEN',
        'Sell request must be OPEN to convert to pickup',
        { status: sellRequest.status },
      );
    }
    const hub = await this.hubRepo.findOne({ where: { id: hubId } });
    if (!hub) {
      throw new DomainError('HUB_NOT_FOUND', 'Hub not found', { hubId });
    }
    if (!sellRequest.items?.length) {
      throw new DomainError('SELL_REQUEST_NO_ITEMS', 'Sell request has no items', { sellRequestId });
    }
    const firstItem = sellRequest.items[0];
    const primaryCategory = firstItem?.materialCategory ?? null;
    const pickup = new Pickup();
    pickup.pickupCode = await this.generatePickupCode();
    pickup.citizen = sellRequest.citizen;
    pickup.address = sellRequest.address;
    pickup.hub = hub;
    pickup.sourceChannel = PickupSourceChannel.WEB_FORM;
    pickup.status = PickupStatus.SCHEDULED;
    pickup.primaryCategory = primaryCategory;
    pickup.notes = sellRequest.notes ?? null;
    try {
      const savedPickup = await this.pickupRepository.savePickup(pickup);
      for (const item of sellRequest.items) {
        const mat = item.materialCategory;
        if (!mat) continue;
        const pi = this.pickupItemRepo.create({
          pickup: savedPickup,
          materialCategory: mat,
          estimatedWeightKg: item.estimatedWeightKg,
          description: item.description ?? null,
        });
        await this.pickupItemRepo.save(pi);
      }
      sellRequest.pickup = savedPickup;
      sellRequest.status = SellRequestStatus.PICKUP_SCHEDULED;
      await this.sellRequestRepo.save(sellRequest);
      try {
        await this.auditLogService.append({
          entityType: 'pickup',
          entityId: savedPickup.id,
          createdByUserId: createdByUserId ?? undefined,
          data: {
            action: 'PICKUP_CREATED_FROM_SELL_REQUEST',
            pickupId: savedPickup.id,
            sellRequestId,
            hubId,
          },
        });
      } catch (auditErr) {
        console.error('Audit log append failed (pickup already created):', auditErr);
      }
      return savedPickup;
    } catch (err) {
      if (err instanceof DomainError) throw err;
      console.error('createPickupFromSellRequest save error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      throw new DomainError(
        'CONVERSION_FAILED',
        /unique|duplicate|constraint/i.test(msg)
          ? 'A pickup for this request may already exist, or the hub is invalid. Please refresh and try again.'
          : 'Failed to save pickup. Please try again or contact support.',
        { originalMessage: msg },
      );
    }
  }
}
