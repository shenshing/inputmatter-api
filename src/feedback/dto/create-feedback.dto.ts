import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
  ArrayMinSize,
} from 'class-validator';

const VALID_CATEGORIES = ['taste', 'service', 'environment', 'other'];

export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsIn(VALID_CATEGORIES, { each: true })
  categories: string[];

  @IsOptional()
  @IsInt()
  @IsPositive()
  shopId?: number;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  shopName?: string;
}
