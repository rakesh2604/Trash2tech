import { MigrationInterface, QueryRunner } from 'typeorm';

export class Anomalies1710000000003 implements MigrationInterface {
  name = 'Anomalies1710000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE anomaly_type AS ENUM ('WEIGHT_VARIANCE');
      CREATE TYPE anomaly_severity AS ENUM ('LOW','MEDIUM','HIGH');

      CREATE TABLE anomalies (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        entity_type varchar(50) NOT NULL,
        entity_id uuid NOT NULL,
        type anomaly_type NOT NULL,
        severity anomaly_severity NOT NULL,
        payload_json jsonb NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE INDEX idx_anomalies_entity ON anomalies(entity_type, entity_id, created_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_anomalies_entity;
      DROP TABLE anomalies;
      DROP TYPE anomaly_type;
      DROP TYPE anomaly_severity;
    `);
  }
}
