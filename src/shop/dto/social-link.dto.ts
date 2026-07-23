import { IsIn, IsUrl } from 'class-validator';

// The only platforms a shop can attach a link for — keep in sync with
// SOCIAL_PLATFORMS in website/src/app/pages/ShopDashboard.tsx.
export const SOCIAL_PLATFORMS = ['tiktok', 'instagram', 'facebook'] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export class SocialLinkDto {
  @IsIn(SOCIAL_PLATFORMS)
  name!: SocialPlatform;

  @IsUrl({}, { message: 'social_link must be a valid URL' })
  social_link!: string;
}
