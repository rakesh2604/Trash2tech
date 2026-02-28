import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/jwt.strategy';
import { CitizenService } from './citizen.service';
import { CreateSellRequestDto } from './dto/create-sell-request.dto';

@Controller('citizen')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CITIZEN')
export class CitizenController {
  constructor(private readonly citizenService: CitizenService) {}

  @Get('campaigns')
  async listCampaigns() {
    return await this.citizenService.listActiveCampaigns();
  }

  @Get('material-categories')
  async listMaterialCategories() {
    return await this.citizenService.listMaterialCategories();
  }

  @Post('sell-requests')
  async createSellRequest(@CurrentUser() user: RequestUser, @Body() dto: CreateSellRequestDto) {
    try {
      return await this.citizenService.createSellRequest(user.id, dto);
    } catch (err: unknown) {
      if (err instanceof HttpException) throw err;
      const msg = err instanceof Error ? err.message : 'Failed to create sell request';
      throw new InternalServerErrorException(msg);
    }
  }

  @Get('sell-requests')
  async listMySellRequests(@CurrentUser() user: RequestUser) {
    try {
      return await this.citizenService.listMySellRequests(user.id);
    } catch (err: unknown) {
      if (err instanceof HttpException) throw err;
      const msg = err instanceof Error ? err.message : 'Failed to list sell requests';
      throw new InternalServerErrorException(msg);
    }
  }

  @Get('sell-requests/:id')
  async getSellRequest(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return await this.citizenService.getSellRequestByIdSanitized(id, user.id);
  }

  @Get('sell-requests/:id/traceability')
  async getTraceability(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return await this.citizenService.getTraceability(id, user.id);
  }
}
