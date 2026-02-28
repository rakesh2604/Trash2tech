import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { IsString, IsUUID } from 'class-validator';
import { AuditLogService } from './audit-log.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

class VerifyAuditQueryDto {
  @IsString()
  entityType!: string;

  @IsUUID()
  entityId!: string;
}

@Controller('audit')
@UseGuards(RolesGuard)
@Roles('ADMIN', 'COORDINATOR')
export class AuditController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get('verify')
  async verify(@Query() query: VerifyAuditQueryDto) {
    return await this.auditLogService.verifyEntityChain(query.entityType, query.entityId);
  }
}
