import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { IncentivesService } from './incentives.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

class ListIncentivesQueryDto {
  @IsOptional()
  @IsIn(['KABADI', 'FIELD_CAPTAIN', 'HUB', 'SOCIETY'])
  actorType?: string;

  @IsOptional()
  @IsIn(['ACCRUED', 'APPROVED', 'PAID'])
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

@Controller('incentives')
@UseGuards(RolesGuard)
@Roles('ADMIN', 'COORDINATOR')
export class IncentivesController {
  constructor(private readonly incentivesService: IncentivesService) {}

  @Get()
  async list(@Query() query: ListIncentivesQueryDto) {
    return await this.incentivesService.list({
      actorType: query.actorType,
      status: query.status,
      limit: query.limit,
    });
  }
}
