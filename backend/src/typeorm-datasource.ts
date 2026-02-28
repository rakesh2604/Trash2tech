import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

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
import { InitialSchema1710000000000 } from './migrations/1710000000000-InitialSchema';
import { BookingRequest } from './entities/booking-request.entity';
import { Campaign } from './entities/campaign.entity';
import { CitizenSellRequest, CitizenSellRequestItem } from './entities/citizen-sell-request.entity';
import { BookingRequests1710000000002 } from './migrations/1710000000002-BookingRequests';
import { Anomaly } from './entities/anomaly.entity';
import { Anomalies1710000000003 } from './migrations/1710000000003-Anomalies';
import { UserAuth1710000000004 } from './migrations/1710000000004-UserAuth';
import { AddCitizenRole1710000000005 } from './migrations/1710000000005-AddCitizenRole';
import { CitizenUserCampaignSellRequest1710000000006 } from './migrations/1710000000006-CitizenUserCampaignSellRequest';
import { SellRequestDetailOptions1710000000007 } from './migrations/1710000000007-SellRequestDetailOptions';

const isDev = process.env.NODE_ENV !== 'production';

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || undefined,
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER ?? process.env.DB_USERNAME ?? 'ewaste',
  password: process.env.DB_PASSWORD ?? 'ewaste_password',
  database: process.env.DB_NAME ?? 'ewaste_mvp',
  synchronize: false,
  logging: isDev,
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
  migrations: [
    InitialSchema1710000000000,
    BookingRequests1710000000002,
    Anomalies1710000000003,
    UserAuth1710000000004,
    AddCitizenRole1710000000005,
    CitizenUserCampaignSellRequest1710000000006,
    SellRequestDetailOptions1710000000007,
  ],
});

export default AppDataSource;
