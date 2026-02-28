import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/jwt.strategy';
import { CitizenService } from './citizen.service';
import { SellRequestStatus } from '../entities/citizen-sell-request.entity';
import { DomainError } from '../common/domain-error';
import { IsNumber, IsUUID, Min } from 'class-validator';

class ConvertToPickupDto {
  @IsUUID()
  hubId!: string;
}

class RecordPaymentDto {
  @IsNumber()
  @Min(0)
  paymentAmountRs!: number;
}

@Controller('admin/sell-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'COORDINATOR')
export class CitizenAdminController {
  constructor(private readonly citizenService: CitizenService) {}

  @Get()
  async listSellRequests(@Query('status') status?: string) {
    try {
      const s =
        status && Object.values(SellRequestStatus).includes(status as SellRequestStatus)
          ? (status as SellRequestStatus)
          : undefined;
      return await this.citizenService.listAllSellRequestsForAdmin(s);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      console.error('listSellRequests error:', err);
      throw new InternalServerErrorException(
        err instanceof Error ? err.message : 'Failed to load sell requests',
      );
    }
  }

  @Post(':id/convert-to-pickup')
  async convertToPickup(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() dto: ConvertToPickupDto,
  ) {
    try {
      return await this.citizenService.convertToPickup(id, dto.hubId, user.id);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      if (err instanceof DomainError)
        throw new BadRequestException(err.message);
      if (err && typeof err === 'object' && 'message' in err && typeof (err as Error).message === 'string') {
        const msg = (err as Error).message;
        if (/not found|invalid|must be OPEN|no items/i.test(msg))
          throw new BadRequestException(msg);
      }
      console.error('convertToPickup error:', err);
      throw new InternalServerErrorException(
        'Failed to convert sell request to pickup. Please ensure the request is OPEN and the hub is valid.',
      );
    }
  }

  @Patch(':id/payment')
  async recordPayment(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() dto: RecordPaymentDto,
  ) {
    try {
      return await this.citizenService.recordPayment(id, dto.paymentAmountRs, user.id);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      console.error('recordPayment error:', err);
      throw new InternalServerErrorException(
        err instanceof Error ? err.message : 'Failed to record payment',
      );
    }
  }
}
