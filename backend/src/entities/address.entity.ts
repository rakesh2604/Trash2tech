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

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Citizen, (citizen) => citizen.addresses)
  @JoinColumn({ name: 'citizen_id' })
  citizen!: Citizen;

  @Column({ type: 'varchar', length: 200 })
  line1!: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  line2!: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  landmark!: string | null;

  @Column({ type: 'varchar', length: 80 })
  city!: string;

  @Column({ type: 'varchar', length: 80 })
  state!: string;

  @Column({ type: 'varchar', length: 10 })
  pincode!: string;

  @Column({ name: 'is_primary', type: 'boolean', default: false })
  isPrimary!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
