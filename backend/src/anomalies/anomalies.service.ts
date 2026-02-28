import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Anomaly, AnomalySeverity, AnomalyType } from '../entities/anomaly.entity';

@Injectable()
export class AnomaliesService {
  constructor(
    @InjectRepository(Anomaly)
    private readonly anomalyRepo: Repository<Anomaly>,
  ) {}

  async create(params: {
    entityType: string;
    entityId: string;
    type: AnomalyType;
    severity: AnomalySeverity;
    payload: Record<string, unknown>;
  }) {
    const record = this.anomalyRepo.create({
      entityType: params.entityType,
      entityId: params.entityId,
      type: params.type,
      severity: params.severity,
      payloadJson: params.payload,
    });
    return await this.anomalyRepo.save(record);
  }

  async list(params: {
    entityType?: string;
    type?: AnomalyType;
    severity?: AnomalySeverity;
    limit?: number;
  }) {
    const take = Math.min(Math.max(params.limit ?? 50, 1), 200);
    const where: Record<string, unknown> = {};
    if (params.entityType) where.entityType = params.entityType;
    if (params.type) where.type = params.type;
    if (params.severity) where.severity = params.severity;

    return await this.anomalyRepo.find({
      where,
      order: { createdAt: 'DESC' },
      take,
    });
  }
}
