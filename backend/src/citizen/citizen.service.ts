import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Citizen, CitizenType } from '../entities/citizen.entity';
import { Address } from '../entities/address.entity';
import { User } from '../entities/user.entity';
import { Campaign } from '../entities/campaign.entity';
import {
  CitizenSellRequest,
  CitizenSellRequestItem,
  SellRequestStatus,
} from '../entities/citizen-sell-request.entity';
import { MaterialCategory } from '../entities/reference.entity';
import { Pickup, PickupStatus } from '../entities/pickup.entity';
import { CreateSellRequestDto } from './dto/create-sell-request.dto';
import { PickupService } from '../pickups/pickup.service';

/** Tentative days from pickup to recycle center (configurable). */
const TENTATIVE_DAYS_TO_RECYCLE = 14;

/** Return a plain object safe for JSON response (no circular refs). Defensive against missing relations. */
function toSanitizedSellRequest(req: CitizenSellRequest): Record<string, unknown> {
  const addr = req.address;
  const address = addr
    ? {
        id: addr.id,
        line1: addr.line1 ?? '',
        line2: addr.line2 ?? null,
        landmark: addr.landmark ?? null,
        city: addr.city ?? '',
        state: addr.state ?? '',
        pincode: addr.pincode ?? '',
      }
    : undefined;
  const camp = req.campaign;
  const campaign = camp
    ? { id: camp.id, name: camp.name, type: camp.type }
    : undefined;
  const pick = req.pickup;
  const pickup = pick
    ? { id: pick.id, pickupCode: pick.pickupCode }
    : undefined;
  const items = (req.items || []).map((i) => {
    const cat = i.materialCategory;
    return {
      id: i.id,
      materialCategoryId: cat?.id,
      materialCategory: cat
        ? { id: cat.id, code: cat.code, description: cat.description }
        : undefined,
      estimatedWeightKg: i.estimatedWeightKg,
      description: i.description ?? null,
    };
  });
  const citizen = req.citizen
    ? { name: req.citizen.name ?? null }
    : undefined;
  return {
    id: req.id,
    status: req.status,
    totalEstimatedKg: req.totalEstimatedKg,
    citizen,
    paymentAmountRs: req.paymentAmountRs ?? null,
    paymentCompletedAt: req.paymentCompletedAt != null ? String(req.paymentCompletedAt).slice(0, 24) : null,
    preferredDateFrom: req.preferredDateFrom != null ? String(req.preferredDateFrom).slice(0, 10) : null,
    preferredDateTo: req.preferredDateTo != null ? String(req.preferredDateTo).slice(0, 10) : null,
    alternatePhone: req.alternatePhone ?? null,
    notes: req.notes ?? null,
    createdAt: req.createdAt != null ? String(req.createdAt) : null,
    updatedAt: req.updatedAt != null ? String(req.updatedAt) : null,
    address,
    campaign,
    pickup,
    items,
  };
}

@Injectable()
export class CitizenService {
  constructor(
    @InjectRepository(Citizen) private readonly citizenRepo: Repository<Citizen>,
    @InjectRepository(Address) private readonly addressRepo: Repository<Address>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Campaign) private readonly campaignRepo: Repository<Campaign>,
    @InjectRepository(CitizenSellRequest)
    private readonly sellRequestRepo: Repository<CitizenSellRequest>,
    @InjectRepository(CitizenSellRequestItem)
    private readonly sellRequestItemRepo: Repository<CitizenSellRequestItem>,
    @InjectRepository(MaterialCategory)
    private readonly categoryRepo: Repository<MaterialCategory>,
    @InjectRepository(Pickup) private readonly pickupRepo: Repository<Pickup>,
    private readonly pickupService: PickupService,
  ) {}

  async getOrCreateCitizenForUser(userId: string): Promise<Citizen> {
    let citizen = await this.citizenRepo
      .createQueryBuilder('c')
      .where('c.user_id = :userId', { userId })
      .getOne();
    if (citizen) return citizen;

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    citizen = this.citizenRepo.create({
      name: user.name,
      whatsappPhone: user.phone,
      ivrPhone: user.phone,
      type: CitizenType.INDIVIDUAL,
      user,
    });
    return await this.citizenRepo.save(citizen);
  }

  async listMaterialCategories() {
    return await this.categoryRepo.find({
      order: { code: 'ASC' },
      select: ['id', 'code', 'description'],
    });
  }

  async listActiveCampaigns() {
    const now = new Date();
    return await this.campaignRepo.find({
      where: {
        isActive: true,
      },
      order: { endAt: 'DESC' },
    }).then((list) =>
      list.filter((c) => new Date(c.startAt) <= now && new Date(c.endAt) >= now),
    );
  }

  async createSellRequest(userId: string, dto: CreateSellRequestDto) {
    const citizen = await this.getOrCreateCitizenForUser(userId);

    if (!dto.items?.length) {
      throw new ForbiddenException('At least one material category with weight is required');
    }

    let campaign: Campaign | null = null;
    if (dto.campaignId) {
      campaign = await this.campaignRepo.findOne({ where: { id: dto.campaignId } });
      if (!campaign) throw new NotFoundException('Campaign not found');
      const now = new Date();
      if (
        !campaign.isActive ||
        new Date(campaign.startAt) > now ||
        new Date(campaign.endAt) < now
      ) {
        campaign = null;
      }
    }

    const address = this.addressRepo.create({
      citizen,
      line1: dto.address.line1,
      line2: dto.address.line2 ?? null,
      landmark: dto.address.landmark ?? null,
      city: dto.address.city,
      state: dto.address.state,
      pincode: dto.address.pincode,
      isPrimary: false,
    });
    const savedAddress = await this.addressRepo.save(address);

    let totalKg = 0;
    const categoryIds = [...new Set(dto.items.map((i) => i.materialCategoryId))];
    const categories = await this.categoryRepo.find({ where: { id: In(categoryIds) } });
    if (categories.length !== categoryIds.length) {
      throw new ForbiddenException('One or more material categories are invalid');
    }

    const sellRequest = this.sellRequestRepo.create({
      citizen,
      address: savedAddress,
      campaign: campaign ?? undefined,
      status: SellRequestStatus.OPEN,
      totalEstimatedKg: '0',
      notes: dto.notes ?? null,
      preferredDateFrom: dto.preferredDateFrom ? new Date(dto.preferredDateFrom) : null,
      preferredDateTo: dto.preferredDateTo ? new Date(dto.preferredDateTo) : null,
      alternatePhone: dto.alternatePhone?.trim() || null,
    });
    const savedRequest = await this.sellRequestRepo.save(sellRequest);

    for (const item of dto.items) {
      const cat = categories.find((c) => c.id === item.materialCategoryId)!;
      totalKg += Number(item.estimatedWeightKg);
      await this.sellRequestItemRepo.save(
        this.sellRequestItemRepo.create({
          sellRequest: savedRequest,
          materialCategory: cat,
          estimatedWeightKg: String(item.estimatedWeightKg),
          description: item.description?.trim() || null,
        }),
      );
    }
    savedRequest.totalEstimatedKg = String(totalKg);
    await this.sellRequestRepo.save(savedRequest);

    const created = await this.getSellRequestById(savedRequest.id, userId);
    return toSanitizedSellRequest(created);
  }

  async listMySellRequests(userId: string) {
    const citizen = await this.getOrCreateCitizenForUser(userId);
    const list = await this.sellRequestRepo
      .createQueryBuilder('sr')
      .leftJoinAndSelect('sr.address', 'address')
      .leftJoinAndSelect('sr.campaign', 'campaign')
      .leftJoinAndSelect('sr.pickup', 'pickup')
      .leftJoinAndSelect('sr.items', 'items')
      .leftJoinAndSelect('items.materialCategory', 'materialCategory')
      .where('sr.citizen_id = :citizenId', { citizenId: citizen.id })
      .orderBy('sr.createdAt', 'DESC')
      .take(100)
      .getMany();
    return list.map((req) => toSanitizedSellRequest(req));
  }

  async getSellRequestById(id: string, userId: string) {
    const citizen = await this.getOrCreateCitizenForUser(userId);
    const req = await this.sellRequestRepo
      .createQueryBuilder('sr')
      .leftJoinAndSelect('sr.address', 'address')
      .leftJoinAndSelect('sr.campaign', 'campaign')
      .leftJoinAndSelect('sr.pickup', 'pickup')
      .leftJoinAndSelect('sr.items', 'items')
      .leftJoinAndSelect('items.materialCategory', 'materialCategory')
      .where('sr.id = :id', { id })
      .andWhere('sr.citizen_id = :citizenId', { citizenId: citizen.id })
      .getOne();
    if (!req) throw new NotFoundException('Sell request not found');
    return req;
  }

  async getSellRequestByIdSanitized(id: string, userId: string) {
    const req = await this.getSellRequestById(id, userId);
    return toSanitizedSellRequest(req);
  }

  async listAllSellRequestsForAdmin(status?: SellRequestStatus) {
    const where: { status?: SellRequestStatus } = {};
    if (status) where.status = status;
    const list = await this.sellRequestRepo.find({
      where,
      relations: { address: true, campaign: true, pickup: true, items: { materialCategory: true }, citizen: true },
      order: { createdAt: 'DESC' },
      take: 200,
    });
    return list.map((req) => toSanitizedSellRequest(req));
  }

  async convertToPickup(sellRequestId: string, hubId: string, adminUserId: string) {
    const pickup = await this.pickupService.createPickupFromSellRequest(
      sellRequestId,
      hubId,
      adminUserId,
    );
    return { id: pickup.id, pickupCode: pickup.pickupCode, status: pickup.status };
  }

  async recordPayment(sellRequestId: string, paymentAmountRs: number, _adminUserId?: string) {
    const req = await this.sellRequestRepo.findOne({
      where: { id: sellRequestId },
      relations: { pickup: true },
    });
    if (!req) throw new NotFoundException('Sell request not found');
    req.paymentAmountRs = String(paymentAmountRs);
    req.paymentCompletedAt = new Date();
    if (req.status === SellRequestStatus.WEIGHED) req.status = SellRequestStatus.PAID;
    await this.sellRequestRepo.save(req);
    return {
      id: req.id,
      status: req.status,
      paymentAmountRs: req.paymentAmountRs,
      paymentCompletedAt: req.paymentCompletedAt?.toISOString(),
    };
  }

  async getTraceability(sellRequestId: string, userId: string) {
    const req = await this.getSellRequestById(sellRequestId, userId);
    const steps: { stage: string; label: string; done: boolean; date?: string; detail?: string }[] = [];
    const statusOrder = [
      SellRequestStatus.OPEN,
      SellRequestStatus.PICKUP_SCHEDULED,
      SellRequestStatus.COLLECTED,
      SellRequestStatus.AT_HUB,
      SellRequestStatus.WEIGHED,
      SellRequestStatus.PAID,
      SellRequestStatus.IN_LOT,
      SellRequestStatus.RECYCLED,
    ];
    const statusLabels: Record<string, string> = {
      OPEN: 'Request raised',
      PICKUP_SCHEDULED: 'Pickup scheduled',
      COLLECTED: 'Collected by vendor',
      AT_HUB: 'At hub',
      WEIGHED: 'Weighed at hub',
      PAID: 'Payment completed',
      IN_LOT: 'In lot for recycler',
      RECYCLED: 'Recycled at facility',
    };
    const currentIdx = statusOrder.indexOf(req.status);
    for (let i = 0; i < statusOrder.length; i++) {
      const s = statusOrder[i];
      steps.push({
        stage: s,
        label: statusLabels[s] ?? s,
        done: i <= currentIdx,
        date: i === 0 ? req.createdAt?.toISOString() : undefined,
      });
    }
    let pickupCode: string | null = null;
    let hubName: string | null = null;
    if (req.pickup) {
      const pickup = await this.pickupRepo.findOne({
        where: { id: req.pickup.id },
        relations: { hub: true },
      });
      if (pickup) {
        pickupCode = pickup.pickupCode;
        hubName = pickup.hub?.name ?? null;
        steps.push({
          stage: 'TRACE',
          label: `Pickup code: ${pickup.pickupCode}. Hub: ${pickup.hub?.name ?? '—'}. Tentative recycle in ~${TENTATIVE_DAYS_TO_RECYCLE} days.`,
          done: pickup.status === PickupStatus.RECYCLED,
          detail: pickup.status,
        });
      }
    }
    return {
      sellRequest: req,
      steps,
      tentativeDaysToRecycle: TENTATIVE_DAYS_TO_RECYCLE,
      paymentAmountRs: req.paymentAmountRs,
      paymentCompletedAt: req.paymentCompletedAt?.toISOString() ?? null,
      pickupCode,
      hubName,
    };
  }
}
