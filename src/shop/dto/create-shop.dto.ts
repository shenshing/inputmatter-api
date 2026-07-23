import { IsString, MinLength, MaxLength, IsOptional, IsIn, IsArray, ArrayMaxSize, ArrayUnique, ValidateNested, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { SocialLinkDto, SOCIAL_PLATFORMS } from './social-link.dto';

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

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(SOCIAL_PLATFORMS.length)
  @ArrayUnique((link: SocialLinkDto) => link?.name)
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  social_link?: SocialLinkDto[];
}
