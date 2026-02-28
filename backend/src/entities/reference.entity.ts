import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'hubs' })
export class Hub {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 160 })
  name!: string;

  @Column({ type: 'text' })
  address!: string;

  @Column({ type: 'varchar', length: 80 })
  city!: string;

  @Column({ type: 'varchar', length: 80 })
  state!: string;

  @Column({ type: 'varchar', length: 10 })
  pincode!: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'manager_user_id' })
  managerUser?: User | null;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

@Entity({ name: 'kabadi' })
export class Kabadi {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 160 })
  name!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone!: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'linked_user_id' })
  linkedUser?: User | null;

  @ManyToOne(() => Hub, { nullable: true })
  @JoinColumn({ name: 'hub_id' })
  hub?: Hub | null;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

@Entity({ name: 'recyclers' })
export class Recycler {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ name: 'facility_address', type: 'text' })
  facilityAddress!: string;

  @Column({ name: 'license_number', type: 'varchar', length: 100 })
  licenseNumber!: string;

  @Column({ name: 'license_valid_till', type: 'date', nullable: true })
  licenseValidTill!: Date | null;

  @Column({ type: 'varchar', length: 80 })
  city!: string;

  @Column({ type: 'varchar', length: 80 })
  state!: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'primary_contact_user_id' })
  primaryContactUser?: User | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

@Entity({ name: 'brands' })
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ name: 'ein_or_cin', type: 'varchar', length: 50 })
  einOrCin!: string;

  @Column({ name: 'epr_registration_number', type: 'varchar', length: 100 })
  eprRegistrationNumber!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

@Entity({ name: 'material_categories' })
export class MaterialCategory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 40, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 200 })
  description!: string;

  @Column({ name: 'is_hazardous', type: 'boolean', default: false })
  isHazardous!: boolean;

  @Column({ name: 'epr_category_code', type: 'varchar', length: 40 })
  eprCategoryCode!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
