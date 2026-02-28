import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Citizen } from './citizen.entity';
import { Address } from './address.entity';
import { Campaign } from './campaign.entity';
import { Pickup } from './pickup.entity';
import { MaterialCategory } from './reference.entity';

export enum SellRequestStatus {
  OPEN = 'OPEN',
  PICKUP_SCHEDULED = 'PICKUP_SCHEDULED',
  COLLECTED = 'COLLECTED',
  AT_HUB = 'AT_HUB',
  WEIGHED = 'WEIGHED',
  PAID = 'PAID',
  IN_LOT = 'IN_LOT',
  RECYCLED = 'RECYCLED',
  CANCELLED = 'CANCELLED',
}

@Entity({ name: 'citizen_sell_requests' })
export class CitizenSellRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Citizen)
  @JoinColumn({ name: 'citizen_id' })
  citizen!: Citizen;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'address_id' })
  address!: Address;

  @ManyToOne(() => Campaign, { nullable: true })
  @JoinColumn({ name: 'campaign_id' })
  campaign?: Campaign | null;

  @Column({ type: 'varchar', length: 40 })
  status!: SellRequestStatus;

  @ManyToOne(() => Pickup, { nullable: true })
  @JoinColumn({ name: 'pickup_id' })
  pickup?: Pickup | null;

  @Column({ name: 'total_estimated_kg', type: 'numeric', precision: 10, scale: 3, default: 0 })
  totalEstimatedKg!: string;

  @Column({ name: 'payment_amount_rs', type: 'numeric', precision: 12, scale: 2, nullable: true })
  paymentAmountRs!: string | null;

  @Column({ name: 'payment_completed_at', type: 'timestamptz', nullable: true })
  paymentCompletedAt!: Date | null;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @Column({ name: 'preferred_date_from', type: 'date', nullable: true })
  preferredDateFrom!: Date | null;

  @Column({ name: 'preferred_date_to', type: 'date', nullable: true })
  preferredDateTo!: Date | null;

  @Column({ name: 'alternate_phone', type: 'varchar', length: 20, nullable: true })
  alternatePhone!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => CitizenSellRequestItem, (item) => item.sellRequest)
  items!: CitizenSellRequestItem[];
}

@Entity({ name: 'citizen_sell_request_items' })
export class CitizenSellRequestItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => CitizenSellRequest, (sr) => sr.items)
  @JoinColumn({ name: 'sell_request_id' })
  sellRequest!: CitizenSellRequest;

  @ManyToOne(() => MaterialCategory)
  @JoinColumn({ name: 'material_category_id' })
  materialCategory!: MaterialCategory;

  @Column({ name: 'estimated_weight_kg', type: 'numeric', precision: 10, scale: 3 })
  estimatedWeightKg!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description!: string | null;
}
