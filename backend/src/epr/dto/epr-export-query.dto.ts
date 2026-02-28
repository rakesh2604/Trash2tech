import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class EprExportQueryDto {
  @IsUUID()
  brandId!: string;

  @IsString()
  @Length(4, 20)
  reportingPeriod!: string;

  @IsOptional()
  @IsString()
  @Length(1, 80)
  state?: string;
}
