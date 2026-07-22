import { IsBoolean } from 'class-validator';

export class UpdateFeedbackVisibilityDto {
  @IsBoolean()
  isPublic!: boolean;
}
