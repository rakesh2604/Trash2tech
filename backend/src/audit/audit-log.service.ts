import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import stableStringify from 'fast-json-stable-stringify';
import { createHash } from 'crypto';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

type AuditAppendParams = {
  entityType: string;
  entityId: string;
  createdByUserId?: string | null;
  data: Record<string, unknown>;
  createdAt?: Date;
};

const GENESIS = 'GENESIS';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  async append(params: AuditAppendParams): Promise<AuditLog> {
    const createdAt = params.createdAt ?? new Date();

    const previous = await this.auditRepo.findOne({
      where: { entityType: params.entityType, entityId: params.entityId },
      order: { createdAt: 'DESC' },
    });

    const prevHash = previous?.hash ?? `${GENESIS}:${params.entityType}`;
    const canonicalData = stableStringify(params.data);
    const actor = params.createdByUserId ?? 'SYSTEM';

    const hashInput = `${prevHash}|${canonicalData}|${createdAt.toISOString()}|${params.entityType}|${params.entityId}|${actor}`;
    const hash = createHash('sha256').update(hashInput).digest('hex');

    const record = this.auditRepo.create({
      entityType: params.entityType,
      entityId: params.entityId,
      prevHash,
      hash,
      dataJson: params.data,
      createdByUserId: params.createdByUserId ?? null,
      createdAt,
    });

    return await this.auditRepo.save(record);
  }

  async verifyEntityChain(
    entityType: string,
    entityId: string,
  ): Promise<{
    ok: boolean;
    brokenAtAuditLogId?: string;
    expectedHash?: string;
    actualHash?: string;
  }> {
    const logs = await this.auditRepo.find({
      where: { entityType, entityId },
      order: { createdAt: 'ASC' },
    });

    let prevHash = `${GENESIS}:${entityType}`;
    for (const log of logs) {
      const canonicalData = stableStringify(log.dataJson);
      const actor = log.createdByUserId ?? 'SYSTEM';
      const hashInput = `${prevHash}|${canonicalData}|${log.createdAt.toISOString()}|${log.entityType}|${log.entityId}|${actor}`;
      const expectedHash = createHash('sha256').update(hashInput).digest('hex');

      if (log.prevHash !== prevHash || log.hash !== expectedHash) {
        return {
          ok: false,
          brokenAtAuditLogId: log.id,
          expectedHash,
          actualHash: log.hash,
        };
      }
      prevHash = log.hash;
    }

    return { ok: true };
  }
}
