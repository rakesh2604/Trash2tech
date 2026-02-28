import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { CreateLotDto } from './dto/create-lot.dto';
import { DispatchLotDto } from './dto/dispatch-lot.dto';
import { RecordHubIntakeDto } from './dto/record-hub-intake.dto';
import { LotService } from './lot.service';
import { LotStatus } from '../entities/lot.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

class LotIdParamDto {
  @IsUUID()
  id!: string;
}

class ListLotsQueryDto {
  @IsOptional()
  @IsUUID()
  hubId?: string;

  @IsOptional()
  @IsUUID()
  recyclerId?: string;

  @IsOptional()
  @IsEnum(LotStatus)
  status?: LotStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

class ListHubIntakesQueryDto {
  @IsUUID()
  hubId!: string;
}

@Controller()
export class LotController {
  constructor(private readonly lotService: LotService) {}

  @UseGuards(RolesGuard)
  @Roles('FIELD_CAPTAIN')
  @Post('hub-intake')
  async recordHubIntake(@Body() dto: RecordHubIntakeDto) {
    return await this.lotService.recordHubIntake(dto);
  }

  @UseGuards(RolesGuard)
  @Roles('FIELD_CAPTAIN')
  @Post('lots')
  async createLot(@Body() dto: CreateLotDto) {
    return await this.lotService.createLot(dto, null);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'COORDINATOR')
  @Post('lots/:id/dispatch')
  async dispatchLot(@Param() params: LotIdParamDto, @Body() dto: DispatchLotDto) {
    return await this.lotService.dispatchLot(params.id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get('lots/:id')
  async getLot(@Param() params: LotIdParamDto) {
    return await this.lotService.getLotById(params.id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'COORDINATOR')
  @Get('lots')
  async listLots(@Query() query: ListLotsQueryDto) {
    return await this.lotService.listLots({
      hubId: query.hubId,
      recyclerId: query.recyclerId,
      status: query.status,
      limit: query.limit,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('FIELD_CAPTAIN')
  @Get('hub-intake-records')
  async listAvailableHubIntakes(@Query() query: ListHubIntakesQueryDto) {
    return await this.lotService.listAvailableHubIntakes(query.hubId);
  }
}
