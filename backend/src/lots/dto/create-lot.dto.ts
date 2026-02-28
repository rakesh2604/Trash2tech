import { ArrayMinSize, IsArray, IsEnum, IsUUID } from 'class-validator';
import { LotStatus } from '../../entities/lot.entity';

export class CreateLotDto {
  @IsUUID()
  hubId!: string;

  @IsUUID()
  recyclerId!: string;

  @IsUUID()
  materialCategoryId!: string;

  @IsEnum(LotStatus)
  status!: LotStatus; // should be CREATED in MVP; kept explicit for ops-driven flexibility

  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  hubIntakeRecordIds!: string[];
}
