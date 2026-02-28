import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsUUID, Length, ValidateNested } from 'class-validator';
import { CitizenType } from '../../entities/citizen.entity';
import { PickupSourceChannel } from '../../entities/pickup.entity';

class CreateAddressDto {
  @IsString()
  @Length(1, 200)
  line1!: string;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  line2?: string;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  landmark?: string;

  @IsString()
  @Length(1, 80)
  city!: string;

  @IsString()
  @Length(1, 80)
  state!: string;

  @IsString()
  @Length(4, 10)
  pincode!: string;
}

export class CreatePickupDto {
  @IsUUID()
  hubId!: string;

  @IsEnum(PickupSourceChannel)
  sourceChannel!: PickupSourceChannel;

  @IsEnum(CitizenType)
  citizenType!: CitizenType;

  @IsOptional()
  @IsString()
  @Length(1, 160)
  citizenName?: string;

  @IsOptional()
  @IsString()
  @Length(5, 20)
  citizenPhone?: string;

  @ValidateNested()
  @Type(() => CreateAddressDto)
  address!: CreateAddressDto;

  @IsOptional()
  @IsUUID()
  primaryCategoryId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 2000)
  notes?: string;
}
