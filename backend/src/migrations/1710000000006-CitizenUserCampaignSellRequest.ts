import { MigrationInterface, QueryRunner } from 'typeorm';

export class CitizenUserCampaignSellRequest1710000000006 implements MigrationInterface {
  name = 'CitizenUserCampaignSellRequest1710000000006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE citizens ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id);
      CREATE INDEX IF NOT EXISTS idx_citizens_user_id ON citizens(user_id);
    `);

    await queryRunner.query(`
      CREATE TYPE campaign_type AS ENUM ('WEEKLY','MONTHLY');
      CREATE TABLE campaigns (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(200) NOT NULL,
        type campaign_type NOT NULL,
        start_at timestamptz NOT NULL,
        end_at timestamptz NOT NULL,
        bonus_per_kg_rs numeric(10,2) NOT NULL DEFAULT 0,
        is_active boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX idx_campaigns_dates ON campaigns(start_at, end_at);
    `);

    await queryRunner.query(`
      CREATE TYPE sell_request_status AS ENUM (
        'OPEN','PICKUP_SCHEDULED','COLLECTED','AT_HUB','WEIGHED','PAID','IN_LOT','RECYCLED','CANCELLED'
      );
      CREATE TABLE citizen_sell_requests (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        citizen_id uuid NOT NULL REFERENCES citizens(id),
        address_id uuid NOT NULL REFERENCES addresses(id),
        campaign_id uuid REFERENCES campaigns(id),
        status sell_request_status NOT NULL DEFAULT 'OPEN',
        pickup_id uuid REFERENCES pickups(id),
        total_estimated_kg numeric(10,3) NOT NULL DEFAULT 0,
        payment_amount_rs numeric(12,2),
        payment_completed_at timestamptz,
        notes text,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX idx_sell_requests_citizen ON citizen_sell_requests(citizen_id);
      CREATE INDEX idx_sell_requests_status ON citizen_sell_requests(status);
      CREATE INDEX idx_sell_requests_created ON citizen_sell_requests(created_at DESC);
    `);

    await queryRunner.query(`
      CREATE TABLE citizen_sell_request_items (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        sell_request_id uuid NOT NULL REFERENCES citizen_sell_requests(id) ON DELETE CASCADE,
        material_category_id uuid NOT NULL REFERENCES material_categories(id),
        estimated_weight_kg numeric(10,3) NOT NULL
      );
      CREATE INDEX idx_sell_request_items_request ON citizen_sell_request_items(sell_request_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS citizen_sell_request_items;`);
    await queryRunner.query(`DROP TABLE IF EXISTS citizen_sell_requests;`);
    await queryRunner.query(`DROP TYPE IF EXISTS sell_request_status;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_campaigns_dates;`);
    await queryRunner.query(`DROP TABLE IF EXISTS campaigns;`);
    await queryRunner.query(`DROP TYPE IF EXISTS campaign_type;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_citizens_user_id;`);
    await queryRunner.query(`ALTER TABLE citizens DROP COLUMN IF EXISTS user_id;`);
  }
}
