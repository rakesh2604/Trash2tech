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
import { Hub, MaterialCategory, Recycler } from './reference.entity';
import { Kabadi } from './reference.entity';
import { Pickup } from './pickup.entity';
import { User } from './user.entity';

export enum LotStatus {
  CREATED = 'CREATED',
  READY_FOR_DISPATCH = 'READY_FOR_DISPATCH',
  IN_TRANSIT = 'IN_TRANSIT',
  RECEIVED_AT_RECYCLER = 'RECEIVED_AT_RECYCLER',
  CLOSED = 'CLOSED',
}

@Entity({ name: 'hub_intake_records' })
export class HubIntakeRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Pickup)
  @JoinColumn({ name: 'pickup_id' })
  pickup!: Pickup;

  @ManyToOne(() => Hub)
  @JoinColumn({ name: 'hub_id' })
  hub!: Hub;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'field_captain_user_id' })
  fieldCaptain!: User;

  @ManyToOne(() => Kabadi, { nullable: true })
  @JoinColumn({ name: 'kabadi_id' })
  kabadi?: Kabadi | null;

  @Column({ name: 'weighed_at', type: 'timestamptz' })
  weighedAt!: Date;

  @ManyToOne(() => MaterialCategory)
  @JoinColumn({ name: 'material_category_id' })
  materialCategory!: MaterialCategory;

  @Column({ name: 'hub_weight_kg', type: 'numeric', precision: 12, scale: 3 })
  hubWeightKg!: string;

  @Column({ type: 'varchar', length: 512 })
  photoUrl!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  geoPoint!: string | null;

  @Column({ type: 'text', nullable: true })
  remarks!: string | null;
}

@Entity({ name: 'lots' })
export class Lot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 40, unique: true })
  lotCode!: string;

  @ManyToOne(() => Hub)
  @JoinColumn({ name: 'hub_id' })
  hub!: Hub;

  @ManyToOne(() => Recycler)
  @JoinColumn({ name: 'recycler_id' })
  recycler!: Recycler;

  @ManyToOne(() => MaterialCategory)
  @JoinColumn({ name: 'material_category_id' })
  materialCategory!: MaterialCategory;

  @Column({ type: 'enum', enum: LotStatus })
  status!: LotStatus;

  @OneToMany(() => LotPickup, (lp) => lp.lot)
  lotPickups!: LotPickup[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

@Entity({ name: 'lot_pickups' })
export class LotPickup {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Lot, (lot) => lot.lotPickups)
  @JoinColumn({ name: 'lot_id' })
  lot!: Lot;

  @ManyToOne(() => HubIntakeRecord)
  @JoinColumn({ name: 'hub_intake_record_id' })
  hubIntakeRecord!: HubIntakeRecord;

  @ManyToOne(() => Pickup)
  @JoinColumn({ name: 'pickup_id' })
  pickup!: Pickup;
}

@Entity({ name: 'lot_dispatches' })
export class LotDispatch {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Lot)
  @JoinColumn({ name: 'lot_id' })
  lot!: Lot;

  @Column({ type: 'varchar', length: 20 })
  vehicleNumber!: string;

  @Column({ type: 'varchar', length: 160 })
  driverName!: string;

  @Column({ type: 'numeric', precision: 12, scale: 3 })
  dispatchWeightKg!: string;

  @Column({ type: 'timestamptz' })
  dispatchTime!: Date;

  @Column({ type: 'varchar', length: 512, nullable: true })
  dispatchDocsUrl!: string | null;
}

@Entity({ name: 'recycler_intakes' })
export class RecyclerIntake {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Lot)
  @JoinColumn({ name: 'lot_id' })
  lot!: Lot;

  @ManyToOne(() => Recycler)
  @JoinColumn({ name: 'recycler_id' })
  recycler!: Recycler;

  @Column({ type: 'numeric', precision: 12, scale: 3 })
  receivedWeightKg!: string;

  @Column({ type: 'timestamptz' })
  receivedTime!: Date;

  @Column({ type: 'numeric', precision: 12, scale: 3 })
  weightVarianceKg!: string;

  @Column({
    type: 'enum',
    enum: ['NORMAL_LOSS', 'SCALE_DIFF', 'SUSPECTED_FRAUD', 'OTHER'],
    default: 'NORMAL_LOSS',
  })
  varianceReason!: 'NORMAL_LOSS' | 'SCALE_DIFF' | 'SUSPECTED_FRAUD' | 'OTHER';

  @Column({ type: 'varchar', length: 512, nullable: true })
  assayReportUrl!: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'confirmed_by_user_id' })
  confirmedBy!: User;
}
