import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Citizen } from './citizen.entity';
import { Address } from './address.entity';
import { Hub, Kabadi, MaterialCategory } from './reference.entity';
import { User } from './user.entity';

export enum PickupSourceChannel {
  WHATSAPP = 'WHATSAPP',
  IVR = 'IVR',
  ADMIN = 'ADMIN',
  WEB_FORM = 'WEB_FORM',
}

export enum PickupStatus {
  NEW = 'NEW',
  SCHEDULED = 'SCHEDULED',
  ASSIGNED = 'ASSIGNED',
  IN_COLLECTION = 'IN_COLLECTION',
  AT_HUB = 'AT_HUB',
  WEIGHED = 'WEIGHED',
  IN_LOT = 'IN_LOT',
  LOT_DISPATCHED = 'LOT_DISPATCHED',
  RECYCLED = 'RECYCLED',
  CANCELLED = 'CANCELLED',
}

@Entity({ name: 'pickups' })
export class Pickup {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'pickup_code', type: 'varchar', length: 40, unique: true })
  pickupCode!: string;

  @ManyToOne(() => Citizen)
  @JoinColumn({ name: 'citizen_id' })
  citizen!: Citizen;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'address_id' })
  address!: Address;

  @ManyToOne(() => Hub)
  @JoinColumn({ name: 'hub_id' })
  hub!: Hub;

  @Column({ name: 'requested_timeslot_start', type: 'timestamptz', nullable: true })
  requestedTimeslotStart!: Date | null;

  @Column({ name: 'requested_timeslot_end', type: 'timestamptz', nullable: true })
  requestedTimeslotEnd!: Date | null;

  @Column({ name: 'source_channel', type: 'enum', enum: PickupSourceChannel })
  sourceChannel!: PickupSourceChannel;

  @Column({ type: 'enum', enum: PickupStatus })
  status!: PickupStatus;

  @ManyToOne(() => MaterialCategory, { nullable: true })
  @JoinColumn({ name: 'primary_category_id' })
  primaryCategory?: MaterialCategory | null;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

@Entity({ name: 'pickup_items' })
export class PickupItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Pickup)
  @JoinColumn({ name: 'pickup_id' })
  pickup!: Pickup;

  @ManyToOne(() => MaterialCategory)
  @JoinColumn({ name: 'material_category_id' })
  materialCategory!: MaterialCategory;

  @Column({ type: 'numeric', precision: 10, scale: 3, nullable: true })
  estimatedWeightKg!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string | null;
}

@Entity({ name: 'pickup_assignments' })
export class PickupAssignment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Pickup)
  @JoinColumn({ name: 'pickup_id' })
  pickup!: Pickup;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'field_captain_user_id' })
  fieldCaptain?: User | null;

  @ManyToOne(() => Kabadi, { nullable: true })
  @JoinColumn({ name: 'kabadi_id' })
  kabadi?: Kabadi | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_by_user_id' })
  assignedBy!: User;

  @Column({
    type: 'enum',
    enum: ['ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'ASSIGNED',
  })
  status!: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

@Entity({ name: 'pickup_events' })
export class PickupEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Pickup)
  @JoinColumn({ name: 'pickup_id' })
  pickup!: Pickup;

  @Column({ type: 'varchar', length: 80 })
  eventType!: string;

  @Column({ type: 'jsonb' })
  payloadJson!: Record<string, unknown>;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'captain_user_id' })
  captainUser?: User | null;

  @ManyToOne(() => Kabadi, { nullable: true })
  @JoinColumn({ name: 'kabadi_id' })
  kabadi?: Kabadi | null;

  @ManyToOne(() => Hub, { nullable: true })
  @JoinColumn({ name: 'hub_id' })
  hub?: Hub | null;

  @Column({ type: 'timestamptz', default: () => 'now()', name: 'created_at' })
  createdAt!: Date;
}
