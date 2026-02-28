import {
  Body,
  Controller,
  Get,
  Header,
  InternalServerErrorException,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EprExportQueryDto } from './dto/epr-export-query.dto';
import { GenerateEprCreditDto } from './dto/generate-epr-credit.dto';
import { EprService } from './epr.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('epr')
export class EprController {
  constructor(private readonly eprService: EprService) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post('credits')
  async generateCredit(@Body() dto: GenerateEprCreditDto) {
    return await this.eprService.generateCreditsForLot({
      lotId: dto.lotId,
      brandId: dto.brandId,
      reportingPeriod: dto.reportingPeriod,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('BRAND', 'ADMIN')
  @Get('export')
  @Header('Content-Type', 'text/csv')
  async exportCsv(@Query() query: EprExportQueryDto) {
    try {
      return await this.eprService.exportCsv({
        brandId: query.brandId,
        reportingPeriod: query.reportingPeriod,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/relation|does not exist|ECONNREFUSED|connect/i.test(msg)) {
        throw new InternalServerErrorException(
          'Database not ready. Run migrations from backend: npm run typeorm:migrate',
        );
      }
      throw err;
    }
  }
}
