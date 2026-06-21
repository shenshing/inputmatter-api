import { IsString, MinLength, MaxLength, IsOptional, IsIn, Matches } from 'class-validator';

export class CreateShopDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsIn(['free', 'basic', 'standard', 'plus'])
  plan?: string;

  @IsOptional()
  @IsString()
  @Matches(/^https:\/\/maps\.app\.goo\.gl\//, {
    message: 'google_map_url must start with https://maps.app.goo.gl/',
  })
  google_map_url?: string;
}
