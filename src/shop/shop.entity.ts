import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type Plan = 'free' | 'basic' | 'standard' | 'plus';

export interface ShopSocialLink {
  name: string;
  social_link: string;
}

@Entity()
export class Shop {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  ownerId!: string | null;

  @Column({ type: 'varchar', default: 'free' })
  plan!: Plan;

  // The short link a shop owner pastes in (e.g. https://maps.app.goo.gl/xyz),
  // kept as entered. Google's short-link redirector is unreliable across
  // browsers (macOS in particular serves a flaky JS interstitial instead of
  // a plain redirect), so this is never used directly for the public-facing
  // link — see google_map_long_url.
  @Column({ type: 'varchar', nullable: true })
  google_map_url!: string | null;

  // The resolved, permanent google.com/maps/place/... URL that google_map_url
  // redirects to — resolved server-side once (see resolveGoogleMapLongUrl in
  // google-maps.util.ts) so visitors' browsers never have to hit Google's
  // short-link redirector themselves. This is what the feedback form links to.
  @Column({ type: 'varchar', nullable: true })
  google_map_long_url!: string | null;

  @Column({ type: 'varchar', nullable: true })
  logo_url!: string | null;

  // Named profile links — e.g. [{ name: 'tiktok', social_link: 'https://...' }].
  // Not yet rendered anywhere on the feedback form; stored for future use.
  @Column({ type: 'jsonb', nullable: true })
  social_link!: ShopSocialLink[] | null;

  @Column({ type: 'boolean', default: true })
  is_public!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
