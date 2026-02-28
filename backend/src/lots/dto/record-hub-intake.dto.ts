import { IsISO8601, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class RecordHubIntakeDto {
  @IsUUID()
  pickupId!: string;

  @IsUUID()
  hubId!: string;

  @IsUUID()
  fieldCaptainUserId!: string;

  @IsOptional()
  @IsUUID()
  kabadiId?: string;

  @IsUUID()
  materialCategoryId!: string;

  @IsString()
  @Length(1, 32)
  hubWeightKg!: string;

  @IsString()
  @Length(5, 512)
  photoUrl!: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  geoPoint?: string;

  @IsOptional()
  @IsString()
  @Length(1, 2000)
  remarks?: string;

  @IsISO8601()
  weighedAt!: string;
}
