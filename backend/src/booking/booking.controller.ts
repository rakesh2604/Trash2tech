import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { BookingChannel, BookingRequestStatus } from '../entities/booking-request.entity';
import { BookingService } from './booking.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

class ListBookingRequestsQueryDto {
  @IsOptional()
  @IsEnum(BookingChannel)
  channel?: BookingChannel;

  @IsOptional()
  @IsEnum(BookingRequestStatus)
  status?: BookingRequestStatus;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

@Controller('booking-requests')
@UseGuards(RolesGuard)
@Roles('ADMIN', 'COORDINATOR')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  async list(@Query() query: ListBookingRequestsQueryDto) {
    return await this.bookingService.list({
      channel: query.channel,
      status: query.status,
      phone: query.phone,
      limit: query.limit,
    });
  }
}
