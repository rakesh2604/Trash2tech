import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EprCredit } from '../entities/epr.entity';
import { Lot, RecyclerIntake } from '../entities/lot.entity';
import { Brand, MaterialCategory } from '../entities/reference.entity';
import { EprController } from './epr.controller';
import { EprService } from './epr.service';

@Module({
  imports: [TypeOrmModule.forFeature([EprCredit, Brand, Lot, RecyclerIntake, MaterialCategory])],
  controllers: [EprController],
  providers: [EprService],
  exports: [EprService],
})
export class EprModule {}
