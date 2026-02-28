import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCitizenRole1710000000005 implements MigrationInterface {
  name = 'AddCitizenRole1710000000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE user_role ADD VALUE 'CITIZEN'`);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // PostgreSQL does not support removing enum values easily.
    // If you need to rollback, you would need to recreate the type and column.
    // Leaving down() as no-op for safety.
  }
}
