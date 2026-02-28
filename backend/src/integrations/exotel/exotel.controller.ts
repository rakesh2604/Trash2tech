import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { IsOptional, IsString, Length } from 'class-validator';
import { Public } from '../../auth/decorators/public.decorator';
import { ExotelService } from './exotel.service';

class ExotelMissedCallDto {
  @IsString()
  @Length(5, 20)
  from!: string;

  @IsOptional()
  @IsString()
  @Length(4, 10)
  pincode?: string;

  @IsOptional()
  @IsString()
  @Length(1, 40)
  categoryHint?: string;
}

@Controller('ivr/exotel')
export class ExotelController {
  constructor(private readonly exotelService: ExotelService) {}

  @Public()
  @Post('missed-call')
  @HttpCode(200)
  async missedCall(@Body() dto: ExotelMissedCallDto) {
    return await this.exotelService.recordMissedCall(dto);
  }
}
