import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BookingChannel,
  BookingRequest,
  BookingRequestStatus,
} from '../../entities/booking-request.entity';

@Injectable()
export class ExotelService {
  constructor(
    @InjectRepository(BookingRequest)
    private readonly bookingRepo: Repository<BookingRequest>,
  ) {}

  async recordMissedCall(params: { from: string; pincode?: string; categoryHint?: string }) {
    const phone = params.from.replace('+', '');
    const record = this.bookingRepo.create({
      channel: BookingChannel.IVR,
      phone,
      pincode: params.pincode ?? null,
      categoryHint: params.categoryHint ?? null,
      payloadJson: {
        raw: params,
        receivedAt: new Date().toISOString(),
      },
      status: BookingRequestStatus.OPEN,
      pickupId: null,
    });
    return await this.bookingRepo.save(record);
  }
}
