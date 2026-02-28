import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ConfirmRecyclerIntakeDto } from './dto/confirm-intake.dto';
import { RecyclerService } from './recycler.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('recycler')
@UseGuards(RolesGuard)
@Roles('RECYCLER')
export class RecyclerController {
  constructor(private readonly recyclerService: RecyclerService) {}

  @Post('intakes')
  async confirmIntake(@Body() dto: ConfirmRecyclerIntakeDto) {
    return await this.recyclerService.confirmIntake(dto);
  }
}
