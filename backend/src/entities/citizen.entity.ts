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
import { Address } from './address.entity';
import { User } from './user.entity';

export enum CitizenType {
  INDIVIDUAL = 'INDIVIDUAL',
  SOCIETY_REP = 'SOCIETY_REP',
  COLLEGE = 'COLLEGE',
  SME = 'SME',
  CORPORATE = 'CORPORATE',
}

@Entity({ name: 'citizens' })
export class Citizen {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 160, nullable: true })
  name!: string | null;

  @Column({ name: 'whatsapp_phone', type: 'varchar', length: 20, nullable: true })
  whatsappPhone!: string | null;

  @Column({ name: 'ivr_phone', type: 'varchar', length: 20, nullable: true })
  ivrPhone!: string | null;

  @Column({ type: 'enum', enum: CitizenType })
  type!: CitizenType;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User | null;

  @OneToMany(() => Address, (address) => address.citizen)
  addresses!: Address[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
