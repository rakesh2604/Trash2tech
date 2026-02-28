import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAuth1710000000004 implements MigrationInterface {
  name = 'UserAuth1710000000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS email varchar(255) UNIQUE;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash varchar(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_users_email;`);
    await queryRunner.query(`
      ALTER TABLE users
        DROP COLUMN IF EXISTS email,
        DROP COLUMN IF EXISTS password_hash,
        DROP COLUMN IF EXISTS is_active;
    `);
  }
}
