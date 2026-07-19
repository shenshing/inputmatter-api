import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

const MAX_IMAGES = 3;

const VALID_SOURCES = ['web', 'telegram'];

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

  @IsOptional()
  @IsString()
  @IsIn(VALID_SOURCES)
  source?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(MAX_IMAGES)
  @IsString({ each: true })
  @MaxLength(2048, { each: true })
  imageUrls?: string[];
}
