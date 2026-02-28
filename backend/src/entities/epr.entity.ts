import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Brand, MaterialCategory } from './reference.entity';
import { Lot } from './lot.entity';

@Entity({ name: 'epr_credits' })
export class EprCredit {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'brand_id' })
  brand!: Brand;

  @ManyToOne(() => Lot)
  @JoinColumn({ name: 'lot_id' })
  lot!: Lot;

  @ManyToOne(() => MaterialCategory)
  @JoinColumn({ name: 'material_category_id' })
  materialCategory!: MaterialCategory;

  @Column({ type: 'numeric', precision: 12, scale: 3 })
  weightKg!: string;

  @CreateDateColumn({ name: 'generated_at' })
  generatedAt!: Date;

  @Column({ type: 'varchar', length: 20 })
  reportingPeriod!: string;
}

@Entity({ name: 'incentive_ledger' })
export class IncentiveLedger {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'actor_type', type: 'enum', enum: ['KABADI', 'FIELD_CAPTAIN', 'HUB', 'SOCIETY'] })
  actorType!: 'KABADI' | 'FIELD_CAPTAIN' | 'HUB' | 'SOCIETY';

  @Column({ name: 'actor_id', type: 'uuid' })
  actorId!: string;

  @Column({ name: 'lot_id', type: 'uuid', nullable: true })
  lotId!: string | null;

  @Column({ name: 'pickup_id', type: 'uuid', nullable: true })
  pickupId!: string | null;

  @Column({ name: 'amount_inr', type: 'numeric', precision: 12, scale: 2 })
  amountInr!: string;

  @Column({
    type: 'enum',
    enum: ['ACCRUED', 'APPROVED', 'PAID'],
    default: 'ACCRUED',
  })
  status!: 'ACCRUED' | 'APPROVED' | 'PAID';

  @Column({ type: 'varchar', length: 80 })
  reason!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
