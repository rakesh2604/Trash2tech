import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';

function emptyStrToUndefined(v: unknown): string | undefined {
  if (v === '' || v === null || v === undefined) return undefined;
  return typeof v === 'string' ? v : undefined;
}

export class SellRequestItemDto {
  @IsUUID()
  materialCategoryId!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.001, { message: 'Weight must be at least 0.001 kg' })
  estimatedWeightKg!: number;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  @Transform(({ value }) => emptyStrToUndefined(value))
  description?: string;
}

class AddressDto {
  @IsString()
  @Length(1, 200)
  line1!: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  @Transform(({ value }) => emptyStrToUndefined(value))
  line2?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  @Transform(({ value }) => emptyStrToUndefined(value))
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

export class CreateSellRequestDto {
  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;

  @IsOptional()
  @IsUUID()
  @Transform(({ value }) => emptyStrToUndefined(value))
  campaignId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SellRequestItemDto)
  items!: SellRequestItemDto[];

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  @Transform(({ value }) => emptyStrToUndefined(value))
  notes?: string;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => emptyStrToUndefined(value))
  preferredDateFrom?: string;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => emptyStrToUndefined(value))
  preferredDateTo?: string;

  @IsOptional()
  @IsString()
  @Length(5, 20)
  @Transform(({ value }) => emptyStrToUndefined(value))
  alternatePhone?: string;
}
