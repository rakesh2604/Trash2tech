import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingRequest } from '../../entities/booking-request.entity';
import { ExotelController } from './exotel.controller';
import { ExotelService } from './exotel.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookingRequest])],
  controllers: [ExotelController],
  providers: [ExotelService],
})
export class ExotelModule {}
