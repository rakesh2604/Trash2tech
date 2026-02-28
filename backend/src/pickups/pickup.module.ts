import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditModule } from '../audit/audit.module';
import { Citizen } from '../entities/citizen.entity';
import { Address } from '../entities/address.entity';
import { Pickup, PickupItem } from '../entities/pickup.entity';
import { Hub, MaterialCategory } from '../entities/reference.entity';
import { CitizenSellRequest, CitizenSellRequestItem } from '../entities/citizen-sell-request.entity';
import { PickupController } from './pickup.controller';
import { PickupRepository } from './pickup.repository';
import { PickupService } from './pickup.service';

@Module({
  imports: [
    AuditModule,
    TypeOrmModule.forFeature([
      Pickup,
      PickupItem,
      Citizen,
      Address,
      Hub,
      MaterialCategory,
      CitizenSellRequest,
      CitizenSellRequestItem,
    ]),
  ],
  controllers: [PickupController],
  providers: [PickupRepository, PickupService],
  exports: [PickupService],
})
export class PickupModule {}
