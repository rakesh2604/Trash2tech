import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export enum AnomalyType {
  WEIGHT_VARIANCE = 'WEIGHT_VARIANCE',
}

export enum AnomalySeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

@Entity({ name: 'anomalies' })
@Index(['entityType', 'entityId', 'createdAt'])
export class Anomaly {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  entityType!: string;

  @Column({ type: 'uuid' })
  entityId!: string;

  @Column({ type: 'enum', enum: AnomalyType })
  type!: AnomalyType;

  @Column({ type: 'enum', enum: AnomalySeverity })
  severity!: AnomalySeverity;

  @Column({ type: 'jsonb' })
  payloadJson!: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
