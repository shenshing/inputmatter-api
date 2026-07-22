import { IsBoolean } from 'class-validator';

export class UpdateShopVisibilityDto {
  @IsBoolean()
  isPublic!: boolean;
}
