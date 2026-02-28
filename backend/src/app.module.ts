import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';
import { Brand, Hub, Kabadi, MaterialCategory, Recycler } from './entities/reference.entity';
import { Citizen } from './entities/citizen.entity';
import { Address } from './entities/address.entity';
import { Pickup, PickupAssignment, PickupEvent, PickupItem } from './entities/pickup.entity';
import {
  HubIntakeRecord,
  Lot,
  LotDispatch,
  LotPickup,
  RecyclerIntake,
} from './entities/lot.entity';
import { AuditLog } from './entities/audit-log.entity';
import { EprCredit, IncentiveLedger } from './entities/epr.entity';
import { BookingRequest } from './entities/booking-request.entity';
import { Campaign } from './entities/campaign.entity';
import { CitizenSellRequest, CitizenSellRequestItem } from './entities/citizen-sell-request.entity';
import { Anomaly } from './entities/anomaly.entity';
import { HealthController } from './health/health.controller';
import { RootController } from './health/root.controller';
import { AuditModule } from './audit/audit.module';
import { PickupModule } from './pickups/pickup.module';
import { LotModule } from './lots/lot.module';
import { RecyclerModule } from './recycler/recycler.module';
import { EprModule } from './epr/epr.module';
import { RedisModule } from './cache/redis.module';
import { WhatsappModule } from './integrations/whatsapp/whatsapp.module';
import { ExotelModule } from './integrations/exotel/exotel.module';
import { BookingModule } from './booking/booking.module';
import { AnomaliesModule } from './anomalies/anomalies.module';
import { IncentivesModule } from './incentives/incentives.module';
import { ReferenceModule } from './reference/reference.module';
import { CitizenModule } from './citizen/citizen.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL || undefined,
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USER ?? process.env.DB_USERNAME ?? 'ewaste',
        password: process.env.DB_PASSWORD || 'ewaste_password',
        database: process.env.DB_NAME || 'ewaste_mvp',
        entities: [
          User,
          Hub,
          Kabadi,
          Recycler,
          Brand,
          MaterialCategory,
          Citizen,
          Address,
          BookingRequest,
          Campaign,
          CitizenSellRequest,
          CitizenSellRequestItem,
          Anomaly,
          Pickup,
          PickupItem,
          PickupAssignment,
          PickupEvent,
          HubIntakeRecord,
          Lot,
          LotPickup,
          LotDispatch,
          RecyclerIntake,
          EprCredit,
          IncentiveLedger,
          AuditLog,
        ],
        synchronize: false,
      }),
    }),
    AuthModule,
    RedisModule,
    AuditModule,
    PickupModule,
    LotModule,
    RecyclerModule,
    EprModule,
    AnomaliesModule,
    IncentivesModule,
    ReferenceModule,
    CitizenModule,
    WhatsappModule,
    ExotelModule,
    BookingModule,
  ],
  controllers: [RootController, HealthController],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
