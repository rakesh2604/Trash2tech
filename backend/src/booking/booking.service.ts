import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BookingChannel,
  BookingRequest,
  BookingRequestStatus,
} from '../entities/booking-request.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingRequest)
    private readonly bookingRepo: Repository<BookingRequest>,
  ) {}

  async list(params: {
    channel?: BookingChannel;
    status?: BookingRequestStatus;
    phone?: string;
    limit?: number;
  }) {
    const take = Math.min(Math.max(params.limit ?? 50, 1), 200);
    const where: Record<string, unknown> = {};
    if (params.channel) where.channel = params.channel;
    if (params.status) where.status = params.status;
    if (params.phone) where.phone = params.phone.replace('+', '');

    return await this.bookingRepo.find({
      where,
      order: { createdAt: 'DESC' },
      take,
    });
  }
}
