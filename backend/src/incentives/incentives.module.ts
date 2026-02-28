import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncentiveLedger } from '../entities/epr.entity';
import { IncentivesController } from './incentives.controller';
import { IncentivesService } from './incentives.service';

@Module({
  imports: [TypeOrmModule.forFeature([IncentiveLedger])],
  controllers: [IncentivesController],
  providers: [IncentivesService],
})
export class IncentivesModule {}
