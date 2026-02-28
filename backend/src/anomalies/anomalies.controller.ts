import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { AnomalySeverity, AnomalyType } from '../entities/anomaly.entity';
import { AnomaliesService } from './anomalies.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

class ListAnomaliesQueryDto {
  @IsOptional()
  entityType?: string;

  @IsOptional()
  @IsEnum(AnomalyType)
  type?: AnomalyType;

  @IsOptional()
  @IsEnum(AnomalySeverity)
  severity?: AnomalySeverity;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

@Controller('anomalies')
@UseGuards(RolesGuard)
@Roles('ADMIN', 'COORDINATOR')
export class AnomaliesController {
  constructor(private readonly anomaliesService: AnomaliesService) {}

  @Get()
  async list(@Query() query: ListAnomaliesQueryDto) {
    return await this.anomaliesService.list({
      entityType: query.entityType,
      type: query.type,
      severity: query.severity,
      limit: query.limit,
    });
  }
}
