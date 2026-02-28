import { MigrationInterface, QueryRunner } from 'typeorm';

export class BookingRequests1710000000002 implements MigrationInterface {
  name = 'BookingRequests1710000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE booking_channel AS ENUM ('WHATSAPP','IVR');
      CREATE TYPE booking_request_status AS ENUM ('OPEN','CONVERTED_TO_PICKUP','CANCELLED');

      CREATE TABLE booking_requests (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        channel booking_channel NOT NULL,
        phone varchar(20) NOT NULL,
        pincode varchar(10),
        category_hint varchar(40),
        payload_json jsonb NOT NULL,
        status booking_request_status NOT NULL DEFAULT 'OPEN',
        pickup_id uuid,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE INDEX idx_booking_requests_phone_status ON booking_requests(phone, status);
      CREATE INDEX idx_booking_requests_created_at ON booking_requests(created_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_booking_requests_created_at;
      DROP INDEX IF EXISTS idx_booking_requests_phone_status;
      DROP TABLE booking_requests;
      DROP TYPE booking_channel;
      DROP TYPE booking_request_status;
    `);
  }
}
