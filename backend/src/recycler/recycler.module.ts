import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditModule } from '../audit/audit.module';
import { LotDispatch, LotPickup, RecyclerIntake } from '../entities/lot.entity';
import { Lot } from '../entities/lot.entity';
import { Pickup } from '../entities/pickup.entity';
import { Recycler } from '../entities/reference.entity';
import { User } from '../entities/user.entity';
import { AnomaliesModule } from '../anomalies/anomalies.module';
import { RecyclerController } from './recycler.controller';
import { RecyclerService } from './recycler.service';

@Module({
  imports: [
    AuditModule,
    AnomaliesModule,
    TypeOrmModule.forFeature([RecyclerIntake, Lot, Recycler, User, LotDispatch, LotPickup, Pickup]),
  ],
  controllers: [RecyclerController],
  providers: [RecyclerService],
  exports: [RecyclerService],
})
export class RecyclerModule {}
