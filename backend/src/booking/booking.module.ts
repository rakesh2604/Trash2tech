import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingRequest } from '../entities/booking-request.entity';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookingRequest])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
