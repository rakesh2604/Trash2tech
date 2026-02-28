import { IsEnum } from 'class-validator';
import { PickupStatus } from '../../entities/pickup.entity';

export class UpdatePickupStatusDto {
  @IsEnum(PickupStatus)
  status!: PickupStatus;
}
