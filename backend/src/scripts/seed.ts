/**
 * Demo seed: admin (with email/password for login), field captain, hub, category, recycler, brand.
 * Run from repo root: npm --workspace backend run seed
 * Or from backend: npm run seed
 */
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../.env') });

import AppDataSource from '../typeorm-datasource';
import { User } from '../entities/user.entity';
import { UserRole, UserStatus } from '../entities/user.entity';
import { Brand, Hub, MaterialCategory, Recycler } from '../entities/reference.entity';
import { Campaign } from '../entities/campaign.entity';
import { CampaignType } from '../entities/campaign.entity';

const DEMO_ADMIN_EMAIL = 'admin@demo.local';
const DEMO_ADMIN_PASSWORD = 'Password123';

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const hubRepo = AppDataSource.getRepository(Hub);
  const categoryRepo = AppDataSource.getRepository(MaterialCategory);
  const recyclerRepo = AppDataSource.getRepository(Recycler);
  const brandRepo = AppDataSource.getRepository(Brand);
  const campaignRepo = AppDataSource.getRepository(Campaign);

  // Admin user for login (email + password). Create or reset password so demo always works.
  const passwordHash = await bcrypt.hash(DEMO_ADMIN_PASSWORD, 10);
  let admin = await userRepo.findOne({ where: { email: DEMO_ADMIN_EMAIL } });
  if (!admin) {
    admin = userRepo.create({
      name: 'Demo Admin',
      email: DEMO_ADMIN_EMAIL,
      passwordHash,
      phone: '9999900000',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      isActive: true,
    });
    await userRepo.save(admin);
    console.log('Created admin:', admin.id, '— login:', DEMO_ADMIN_EMAIL, '/', DEMO_ADMIN_PASSWORD);
  } else {
    admin.passwordHash = passwordHash;
    admin.isActive = true;
    admin.status = UserStatus.ACTIVE;
    await userRepo.save(admin);
    console.log('Updated demo admin password — login:', DEMO_ADMIN_EMAIL, '/', DEMO_ADMIN_PASSWORD);
  }

  let user = await userRepo.findOne({ where: { phone: '9999900001' } });
  if (!user) {
    user = userRepo.create({
      name: 'Demo Field Captain',
      phone: '9999900001',
      role: UserRole.FIELD_CAPTAIN,
      status: UserStatus.ACTIVE,
      isActive: true,
    });
    await userRepo.save(user);
    console.log('Created user:', user.id);
  }

  let hub = await hubRepo.findOne({ where: { name: 'Mumbai Central Hub' } });
  if (!hub) {
    hub = hubRepo.create({
      name: 'Mumbai Central Hub',
      address: 'Unit 1, Industrial Area, Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400069',
      managerUser: user,
      active: true,
    });
    await hubRepo.save(hub);
    console.log('Created hub:', hub.id, '— set DEFAULT_HUB_ID=' + hub.id);
  }

  let category = await categoryRepo.findOne({ where: { code: 'ITEW' } });
  if (!category) {
    category = categoryRepo.create({
      code: 'ITEW',
      description: 'IT and telecom equipment',
      isHazardous: false,
      eprCategoryCode: '1',
    });
    await categoryRepo.save(category);
    console.log('Created material category:', category.id, category.code);
  }
  let cat2 = await categoryRepo.findOne({ where: { code: 'CEE' } });
  if (!cat2) {
    cat2 = categoryRepo.create({
      code: 'CEE',
      description: 'Consumer electrical and electronics',
      isHazardous: false,
      eprCategoryCode: '2',
    });
    await categoryRepo.save(cat2);
    console.log('Created material category:', cat2.id, cat2.code);
  }

  const now = new Date();
  const campaignStart = new Date(now);
  campaignStart.setDate(campaignStart.getDate() - 2);
  const campaignEnd = new Date(now);
  campaignEnd.setDate(campaignEnd.getDate() + 28);
  const campaignEndPlus = new Date(now);
  campaignEndPlus.setDate(campaignEndPlus.getDate() + 60);
  const campaignsToSeed = [
    { name: 'Monthly E-Waste Bonus', type: CampaignType.MONTHLY as const, bonusPerKgRs: '5', description: 'Sell your e-waste this month and get ₹5 extra per kg. Covers all categories: IT equipment, consumer electronics, batteries, lamps, cables, and more. Valid for pickups completed before the campaign end date.' },
    { name: 'Summer E-Waste Drive', type: CampaignType.MONTHLY as const, bonusPerKgRs: '8', description: 'Summer special: ₹8 extra per kg on all e-waste. Laptops, mobiles, cables, and appliances. Help reduce e-waste this season.' },
    { name: 'Laptop & Mobile Exchange Bonus', type: CampaignType.WEEKLY as const, bonusPerKgRs: '10', description: 'Focus on laptops and mobile devices. ₹10 per kg bonus for this week. Old phones and laptops get higher value.' },
    { name: 'Corporate Takeback Week', type: CampaignType.WEEKLY as const, bonusPerKgRs: '7', description: 'For offices and institutions. Bulk e-waste pickup with ₹7/kg bonus. Desktops, servers, and office equipment welcome.' },
    { name: 'Festival Recycling Bonus', type: CampaignType.MONTHLY as const, bonusPerKgRs: '6', description: 'Festival special: recycle old electronics and get ₹6 extra per kg. Clean up before the festivities.' },
    { name: 'Battery & Lamp Safe Disposal', type: CampaignType.MONTHLY as const, bonusPerKgRs: '4', description: 'Batteries and lamps only. ₹4/kg bonus for safe, traceable disposal. CFL, LED, Li-ion, lead-acid.' },
  ];
  for (const c of campaignsToSeed) {
    let campaign = await campaignRepo.findOne({ where: { name: c.name } });
    if (!campaign) {
      campaign = campaignRepo.create({
        name: c.name,
        description: c.description,
        type: c.type,
        startAt: campaignStart,
        endAt: c.type === CampaignType.WEEKLY ? campaignEnd : campaignEndPlus,
        bonusPerKgRs: c.bonusPerKgRs,
        isActive: true,
      });
      await campaignRepo.save(campaign);
      console.log('Created campaign:', campaign.id, c.name);
    }
  }

  const extraCategories = [
    { code: 'BAT', description: 'Batteries (Li-ion, lead-acid, etc.)', epr: '3' },
    { code: 'LAMP', description: 'Lamps and lighting equipment', epr: '4' },
    { code: 'SCR', description: 'Screens, panels, monitors', epr: '5' },
    { code: 'CABLE', description: 'Cables and wiring', epr: '6' },
    { code: 'SML', description: 'Small IT and telecom equipment', epr: '7' },
    { code: 'PV', description: 'Solar PV panels', epr: '8' },
  ];
  for (const { code, description, epr } of extraCategories) {
    const existing = await categoryRepo.findOne({ where: { code } });
    if (!existing) {
      const c = categoryRepo.create({ code, description, isHazardous: false, eprCategoryCode: epr });
      await categoryRepo.save(c);
      console.log('Created material category:', c.id, code);
    }
  }

  let recycler = await recyclerRepo.findOne({ where: { licenseNumber: 'REC-DEMO-001' } });
  if (!recycler) {
    recycler = recyclerRepo.create({
      name: 'Demo Authorized Recycler',
      facilityAddress: 'Recycler Park, Bhiwandi',
      licenseNumber: 'REC-DEMO-001',
      licenseValidTill: null,
      city: 'Bhiwandi',
      state: 'Maharashtra',
    });
    await recyclerRepo.save(recycler);
    console.log('Created recycler:', recycler.id);
  }

  let brand = await brandRepo.findOne({ where: { eprRegistrationNumber: 'EPR-DEMO-001' } });
  if (!brand) {
    brand = brandRepo.create({
      name: 'Demo EPR Brand',
      einOrCin: 'DEMO-EIN-001',
      eprRegistrationNumber: 'EPR-DEMO-001',
    });
    await brandRepo.save(brand);
    console.log('Created brand:', brand.id, '— for EPR export use brandId=' + brand.id);
  }

  await AppDataSource.destroy();
  console.log('\nSeed done. Use these in .env / demo:');
  console.log('DEFAULT_HUB_ID=' + hub.id);
  console.log('Login: email', DEMO_ADMIN_EMAIL, 'password', DEMO_ADMIN_PASSWORD);
  console.log('Demo IDs — user:', user.id, '| category:', category.id, '| recycler:', recycler.id, '| brand:', brand.id);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
