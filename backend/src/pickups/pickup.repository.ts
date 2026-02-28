import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../entities/address.entity';
import { Pickup } from '../entities/pickup.entity';
import { Citizen } from '../entities/citizen.entity';
import { PickupStatus } from '../entities/pickup.entity';

@Injectable()
export class PickupRepository {
  constructor(
    @InjectRepository(Pickup) private readonly pickupRepo: Repository<Pickup>,
    @InjectRepository(Citizen) private readonly citizenRepo: Repository<Citizen>,
    @InjectRepository(Address) private readonly addressRepo: Repository<Address>,
  ) {}

  async saveCitizen(citizen: Citizen): Promise<Citizen> {
    return await this.citizenRepo.save(citizen);
  }

  async saveAddress(address: Address): Promise<Address> {
    return await this.addressRepo.save(address);
  }

  async savePickup(pickup: Pickup): Promise<Pickup> {
    return await this.pickupRepo.save(pickup);
  }

  async findPickupById(id: string): Promise<Pickup | null> {
    return await this.pickupRepo.findOne({
      where: { id },
      relations: { citizen: true, address: true, hub: true, primaryCategory: true },
    });
  }

  async listPickups(params: {
    hubId?: string;
    status?: PickupStatus;
    limit?: number;
  }): Promise<Pickup[]> {
    const rawLimit = params.limit ?? 50;
    const take = Math.min(Math.max(Number(rawLimit) || 50, 1), 200);
    const where: Record<string, unknown> = {};
    if (params.hubId) where.hub = { id: params.hubId };
    if (params.status) where.status = params.status;

    return await this.pickupRepo.find({
      where,
      relations: { citizen: true, address: true, hub: true, primaryCategory: true },
      order: { createdAt: 'DESC' },
      take,
    });
  }
}
