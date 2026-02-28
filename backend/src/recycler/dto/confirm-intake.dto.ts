import { IsIn, IsISO8601, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class ConfirmRecyclerIntakeDto {
  @IsUUID()
  lotId!: string;

  @IsUUID()
  recyclerId!: string;

  @IsString()
  @Length(1, 32)
  receivedWeightKg!: string;

  @IsISO8601()
  receivedTime!: string;

  @IsIn(['NORMAL_LOSS', 'SCALE_DIFF', 'SUSPECTED_FRAUD', 'OTHER'])
  varianceReason!: 'NORMAL_LOSS' | 'SCALE_DIFF' | 'SUSPECTED_FRAUD' | 'OTHER';

  @IsUUID()
  confirmedByUserId!: string;

  @IsOptional()
  @IsString()
  @Length(5, 512)
  assayReportUrl?: string;
}
