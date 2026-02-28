import { IsISO8601, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class DispatchLotDto {
  @IsString()
  @Length(3, 20)
  vehicleNumber!: string;

  @IsString()
  @Length(2, 160)
  driverName!: string;

  @IsString()
  @Length(1, 32)
  dispatchWeightKg!: string;

  @IsISO8601()
  dispatchTime!: string;

  @IsOptional()
  @IsString()
  @Length(5, 512)
  dispatchDocsUrl?: string;

  @IsOptional()
  @IsUUID()
  updatedByUserId?: string;
}
