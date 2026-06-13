import { IsString, MinLength, MaxLength, IsOptional, IsIn } from 'class-validator';

export class CreateShopDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsIn(['free', 'basic', 'standard', 'plus'])
  plan?: string;
}
