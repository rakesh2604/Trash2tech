import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Citizen } from '../entities/citizen.entity';
import { Address } from '../entities/address.entity';
import { User } from '../entities/user.entity';
import { Campaign } from '../entities/campaign.entity';
import {
  CitizenSellRequest,
  CitizenSellRequestItem,
} from '../entities/citizen-sell-request.entity';
import { MaterialCategory } from '../entities/reference.entity';
import { Pickup } from '../entities/pickup.entity';
import { PickupModule } from '../pickups/pickup.module';
import { CitizenController } from './citizen.controller';
import { CitizenAdminController } from './citizen-admin.controller';
import { CitizenService } from './citizen.service';

@Module({
  imports: [
    PickupModule,
    TypeOrmModule.forFeature([
      Citizen,
      Address,
      User,
      Campaign,
      CitizenSellRequest,
      CitizenSellRequestItem,
      MaterialCategory,
      Pickup,
    ]),
  ],
  controllers: [CitizenController, CitizenAdminController],
  providers: [CitizenService],
  exports: [CitizenService],
})
export class CitizenModule {}
