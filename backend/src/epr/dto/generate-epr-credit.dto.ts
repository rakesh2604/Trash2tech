import { IsString, IsUUID, Length } from 'class-validator';

export class GenerateEprCreditDto {
  @IsUUID()
  lotId!: string;

  @IsUUID()
  brandId!: string;

  @IsString()
  @Length(4, 20)
  reportingPeriod!: string;
}
