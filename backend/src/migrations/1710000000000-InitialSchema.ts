import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1710000000000 implements MigrationInterface {
  name = 'InitialSchema1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;

      CREATE TYPE user_role AS ENUM ('ADMIN','FIELD_CAPTAIN','RECYCLER_USER','BRAND_USER','COORDINATOR');
      CREATE TYPE user_status AS ENUM ('ACTIVE','INACTIVE');
      CREATE TABLE users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(160) NOT NULL,
        phone varchar(20) UNIQUE NOT NULL,
        role user_role NOT NULL,
        status user_status NOT NULL DEFAULT 'ACTIVE',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX idx_users_phone ON users(phone);
      CREATE INDEX idx_users_role ON users(role);

      CREATE TABLE hubs (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(160) NOT NULL,
        address text NOT NULL,
        city varchar(80) NOT NULL,
        state varchar(80) NOT NULL,
        pincode varchar(10) NOT NULL,
        manager_user_id uuid NULL REFERENCES users(id),
        active boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE kabadi (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(160) NOT NULL,
        phone varchar(20),
        linked_user_id uuid NULL REFERENCES users(id),
        hub_id uuid NULL REFERENCES hubs(id),
        notes text,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE recyclers (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(200) NOT NULL,
        facility_address text NOT NULL,
        license_number varchar(100) NOT NULL,
        license_valid_till date,
        city varchar(80) NOT NULL,
        state varchar(80) NOT NULL,
        primary_contact_user_id uuid NULL REFERENCES users(id),
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE brands (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(200) NOT NULL,
        ein_or_cin varchar(50) NOT NULL,
        epr_registration_number varchar(100) NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE material_categories (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        code varchar(40) UNIQUE NOT NULL,
        description varchar(200) NOT NULL,
        is_hazardous boolean NOT NULL DEFAULT false,
        epr_category_code varchar(40) NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TYPE citizen_type AS ENUM ('INDIVIDUAL','SOCIETY_REP','COLLEGE','SME','CORPORATE');
      CREATE TABLE citizens (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(160),
        whatsapp_phone varchar(20),
        ivr_phone varchar(20),
        type citizen_type NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE addresses (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        citizen_id uuid NOT NULL REFERENCES citizens(id),
        line1 varchar(200) NOT NULL,
        line2 varchar(200),
        landmark varchar(200),
        city varchar(80) NOT NULL,
        state varchar(80) NOT NULL,
        pincode varchar(10) NOT NULL,
        is_primary boolean NOT NULL DEFAULT false,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TYPE pickup_source_channel AS ENUM ('WHATSAPP','IVR','ADMIN','WEB_FORM');
      CREATE TYPE pickup_status AS ENUM (
        'NEW','SCHEDULED','ASSIGNED','IN_COLLECTION','AT_HUB','WEIGHED','IN_LOT','LOT_DISPATCHED','RECYCLED','CANCELLED'
      );
      CREATE TABLE pickups (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        pickup_code varchar(40) UNIQUE NOT NULL,
        citizen_id uuid NOT NULL REFERENCES citizens(id),
        address_id uuid NOT NULL REFERENCES addresses(id),
        hub_id uuid NOT NULL REFERENCES hubs(id),
        requested_timeslot_start timestamptz,
        requested_timeslot_end timestamptz,
        source_channel pickup_source_channel NOT NULL,
        status pickup_status NOT NULL,
        primary_category_id uuid REFERENCES material_categories(id),
        notes text,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX idx_pickups_code ON pickups(pickup_code);
      CREATE INDEX idx_pickups_hub_status ON pickups(hub_id, status);
      CREATE INDEX idx_pickups_citizen_created ON pickups(citizen_id, created_at);

      CREATE TABLE pickup_items (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        pickup_id uuid NOT NULL REFERENCES pickups(id),
        material_category_id uuid NOT NULL REFERENCES material_categories(id),
        estimated_weight_kg numeric(10,3),
        description varchar(255)
      );

      CREATE TYPE assignment_status AS ENUM ('ASSIGNED','IN_PROGRESS','COMPLETED','CANCELLED');
      CREATE TABLE pickup_assignments (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        pickup_id uuid NOT NULL REFERENCES pickups(id),
        field_captain_user_id uuid REFERENCES users(id),
        kabadi_id uuid REFERENCES kabadi(id),
        assigned_by_user_id uuid NOT NULL REFERENCES users(id),
        status assignment_status NOT NULL DEFAULT 'ASSIGNED',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE pickup_events (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        pickup_id uuid NOT NULL REFERENCES pickups(id),
        event_type varchar(80) NOT NULL,
        payload_json jsonb NOT NULL,
        captain_user_id uuid REFERENCES users(id),
        kabadi_id uuid REFERENCES kabadi(id),
        hub_id uuid REFERENCES hubs(id),
        created_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TYPE lot_status AS ENUM ('CREATED','READY_FOR_DISPATCH','IN_TRANSIT','RECEIVED_AT_RECYCLER','CLOSED');
      CREATE TABLE hub_intake_records (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        pickup_id uuid NOT NULL REFERENCES pickups(id),
        hub_id uuid NOT NULL REFERENCES hubs(id),
        field_captain_user_id uuid NOT NULL REFERENCES users(id),
        kabadi_id uuid REFERENCES kabadi(id),
        weighed_at timestamptz NOT NULL,
        hub_weight_kg numeric(12,3) NOT NULL,
        material_category_id uuid NOT NULL REFERENCES material_categories(id),
        photo_url varchar(512) NOT NULL,
        geo_point varchar(100),
        remarks text
      );

      CREATE TABLE lots (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        lot_code varchar(40) UNIQUE NOT NULL,
        hub_id uuid NOT NULL REFERENCES hubs(id),
        recycler_id uuid NOT NULL REFERENCES recyclers(id),
        material_category_id uuid NOT NULL REFERENCES material_categories(id),
        status lot_status NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE lot_pickups (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        lot_id uuid NOT NULL REFERENCES lots(id),
        hub_intake_record_id uuid NOT NULL REFERENCES hub_intake_records(id),
        pickup_id uuid NOT NULL REFERENCES pickups(id),
        CONSTRAINT uq_lot_pickups_hub_intake UNIQUE (hub_intake_record_id)
      );

      CREATE TABLE lot_dispatches (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        lot_id uuid NOT NULL REFERENCES lots(id),
        vehicle_number varchar(20) NOT NULL,
        driver_name varchar(160) NOT NULL,
        dispatch_weight_kg numeric(12,3) NOT NULL,
        dispatch_time timestamptz NOT NULL,
        dispatch_docs_url varchar(512)
      );

      CREATE TYPE variance_reason AS ENUM ('NORMAL_LOSS','SCALE_DIFF','SUSPECTED_FRAUD','OTHER');
      CREATE TABLE recycler_intakes (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        lot_id uuid NOT NULL REFERENCES lots(id),
        recycler_id uuid NOT NULL REFERENCES recyclers(id),
        received_weight_kg numeric(12,3) NOT NULL,
        received_time timestamptz NOT NULL,
        weight_variance_kg numeric(12,3) NOT NULL,
        variance_reason variance_reason NOT NULL DEFAULT 'NORMAL_LOSS',
        assay_report_url varchar(512),
        confirmed_by_user_id uuid NOT NULL REFERENCES users(id)
      );

      CREATE TABLE epr_credits (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        brand_id uuid NOT NULL REFERENCES brands(id),
        lot_id uuid NOT NULL REFERENCES lots(id),
        material_category_id uuid NOT NULL REFERENCES material_categories(id),
        weight_kg numeric(12,3) NOT NULL,
        generated_at timestamptz NOT NULL DEFAULT now(),
        reporting_period varchar(20) NOT NULL
      );

      CREATE TYPE incentive_status AS ENUM ('ACCRUED','APPROVED','PAID');
      CREATE TYPE incentive_actor_type AS ENUM ('KABADI','FIELD_CAPTAIN','HUB','SOCIETY');
      CREATE TABLE incentive_ledger (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        actor_type incentive_actor_type NOT NULL,
        actor_id uuid NOT NULL,
        lot_id uuid,
        pickup_id uuid,
        amount_inr numeric(12,2) NOT NULL,
        reason varchar(80) NOT NULL,
        status incentive_status NOT NULL DEFAULT 'ACCRUED',
        created_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE audit_log (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        entity_type varchar(50) NOT NULL,
        entity_id uuid NOT NULL,
        prev_hash varchar(256),
        hash varchar(256) NOT NULL,
        data_json jsonb NOT NULL,
        created_by_user_id uuid,
        created_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id, created_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_audit_entity;
      DROP TABLE audit_log;
      DROP TABLE incentive_ledger;
      DROP TYPE incentive_status;
      DROP TYPE incentive_actor_type;
      DROP TABLE epr_credits;
      DROP TABLE recycler_intakes;
      DROP TYPE variance_reason;
      DROP TABLE lot_dispatches;
      DROP TABLE lot_pickups;
      DROP TABLE lots;
      DROP TYPE lot_status;
      DROP TABLE hub_intake_records;
      DROP TABLE pickup_events;
      DROP TABLE pickup_assignments;
      DROP TYPE assignment_status;
      DROP TABLE pickup_items;
      DROP TABLE pickups;
      DROP TYPE pickup_source_channel;
      DROP TYPE pickup_status;
      DROP TABLE addresses;
      DROP TABLE citizens;
      DROP TYPE citizen_type;
      DROP TABLE material_categories;
      DROP TABLE brands;
      DROP TABLE recyclers;
      DROP TABLE kabadi;
      DROP TABLE hubs;
      DROP INDEX IF EXISTS idx_users_phone;
      DROP INDEX IF EXISTS idx_users_role;
      DROP TABLE users;
      DROP TYPE user_role;
      DROP TYPE user_status;
    `);
  }
}
