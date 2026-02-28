import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IncentiveLedger } from '../entities/epr.entity';

@Injectable()
export class IncentivesService {
  constructor(
    @InjectRepository(IncentiveLedger)
    private readonly ledgerRepo: Repository<IncentiveLedger>,
  ) {}

  async list(params: { actorType?: string; status?: string; limit?: number }) {
    const take = Math.min(Math.max(params.limit ?? 50, 1), 200);
    const where: Record<string, unknown> = {};
    if (params.actorType) where.actorType = params.actorType;
    if (params.status) where.status = params.status;
    return await this.ledgerRepo.find({
      where,
      order: { createdAt: 'DESC' },
      take,
    });
  }
}
