import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePickupDto } from './dto/create-pickup.dto';
import { UpdatePickupStatusDto } from './dto/update-pickup-status.dto';
import { PickupService } from './pickup.service';
import { PickupStatus } from '../entities/pickup.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

class PickupIdParamDto {
  @IsUUID()
  id!: string;
}

class ListPickupsQueryDto {
  @IsOptional()
  @IsUUID()
  hubId?: string;

  @IsOptional()
  @IsEnum(PickupStatus)
  status?: PickupStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

@Controller('pickups')
@UseGuards(RolesGuard)
@Roles('ADMIN', 'COORDINATOR')
export class PickupController {
  constructor(private readonly pickupService: PickupService) {}

  @Post()
  async createPickup(@Body() dto: CreatePickupDto) {
    return await this.pickupService.createPickup(dto, null);
  }

  @Patch(':id/status')
  async updateStatus(@Param() params: PickupIdParamDto, @Body() dto: UpdatePickupStatusDto) {
    return await this.pickupService.updateStatus(params.id, dto.status, null);
  }

  @Get(':id')
  async getPickup(@Param() params: PickupIdParamDto) {
    return await this.pickupService.getPickupById(params.id);
  }

  @Get()
  async listPickups(@Query() query: ListPickupsQueryDto) {
    const limit =
      query.limit != null && Number.isInteger(query.limit) && query.limit >= 1 ? query.limit : 50;
    try {
      return await this.pickupService.listPickups({
        hubId: query.hubId,
        status: query.status,
        limit,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/relation|does not exist|ECONNREFUSED|connect/i.test(msg)) {
        throw new InternalServerErrorException(
          'Database not ready. Run migrations: npm run typeorm:migrate (from backend).',
        );
      }
      throw err;
    }
  }
}
