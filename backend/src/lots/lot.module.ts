import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditModule } from '../audit/audit.module';
import { Pickup } from '../entities/pickup.entity';
import { HubIntakeRecord, Lot, LotDispatch, LotPickup } from '../entities/lot.entity';
import { Hub, Kabadi, MaterialCategory, Recycler } from '../entities/reference.entity';
import { User } from '../entities/user.entity';
import { LotController } from './lot.controller';
import { LotService } from './lot.service';

@Module({
  imports: [
    AuditModule,
    TypeOrmModule.forFeature([
      HubIntakeRecord,
      Lot,
      LotPickup,
      LotDispatch,
      Pickup,
      Hub,
      User,
      Kabadi,
      MaterialCategory,
      Recycler,
    ]),
  ],
  controllers: [LotController],
  providers: [LotService],
  exports: [LotService],
})
export class LotModule {}
