import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BookingChannel {
  WHATSAPP = 'WHATSAPP',
  IVR = 'IVR',
}

export enum BookingRequestStatus {
  OPEN = 'OPEN',
  CONVERTED_TO_PICKUP = 'CONVERTED_TO_PICKUP',
  CANCELLED = 'CANCELLED',
}

@Entity({ name: 'booking_requests' })
export class BookingRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: BookingChannel })
  channel!: BookingChannel;

  @Column({ type: 'varchar', length: 20 })
  phone!: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  pincode!: string | null;

  @Column({ type: 'varchar', length: 40, nullable: true })
  categoryHint!: string | null;

  @Column({ type: 'jsonb' })
  payloadJson!: Record<string, unknown>;

  @Column({ type: 'enum', enum: BookingRequestStatus, default: BookingRequestStatus.OPEN })
  status!: BookingRequestStatus;

  @Column({ type: 'uuid', nullable: true })
  pickupId!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
