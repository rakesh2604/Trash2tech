import { MigrationInterface, QueryRunner } from 'typeorm';

export class SellRequestDetailOptions1710000000007 implements MigrationInterface {
  name = 'SellRequestDetailOptions1710000000007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS description text;
    `);
    await queryRunner.query(`
      ALTER TABLE citizen_sell_requests
        ADD COLUMN IF NOT EXISTS preferred_date_from date,
        ADD COLUMN IF NOT EXISTS preferred_date_to date,
        ADD COLUMN IF NOT EXISTS alternate_phone varchar(20);
    `);
    await queryRunner.query(`
      ALTER TABLE citizen_sell_request_items ADD COLUMN IF NOT EXISTS description varchar(500);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE campaigns DROP COLUMN IF EXISTS description;`);
    await queryRunner.query(`
      ALTER TABLE citizen_sell_requests
        DROP COLUMN IF EXISTS preferred_date_from,
        DROP COLUMN IF EXISTS preferred_date_to,
        DROP COLUMN IF EXISTS alternate_phone;
    `);
    await queryRunner.query(`ALTER TABLE citizen_sell_request_items DROP COLUMN IF EXISTS description;`);
  }
}
