import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type Plan = 'free' | 'basic' | 'standard' | 'plus';

// A shop can belong to more than one category (e.g. a place that's both a
// cafe and a restaurant), hence the array column rather than a single value.
export const SHOP_CATEGORIES = ['cafe', 'restaurant', 'hotpot'] as const;
export type ShopCategory = (typeof SHOP_CATEGORIES)[number];

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

  @Column({ type: 'varchar', nullable: true })
  phone!: string | null;

  // e.g. ['Delivery', 'Takeaway', 'Dine-in'] — Google Maps' "Service options"
  // list, kept as free-form strings since the set of possible options varies
  // by business type rather than being a fixed enum.
  @Column({ type: 'jsonb', nullable: true })
  service_options!: string[] | null;

  // Regular weekly schedule, e.g. { status: 'Closed', schedule: [{ day: 'Monday',
  // hours: '9:30 AM–9:30 PM' }, ...] }. Named "opening_hours" (not "hours") to stay
  // distinct from one-off holiday/closure announcements, which live in their own table.
  @Column({ type: 'jsonb', nullable: true })
  opening_hours!: { status: string | null; schedule: { day: string; hours: string }[] | null } | null;

  // Named profile links — e.g. [{ name: 'tiktok', social_link: 'https://...' }].
  // Not yet rendered anywhere on the feedback form; stored for future use.
  @Column({ type: 'jsonb', nullable: true })
  social_link!: ShopSocialLink[] | null;

  @Column({ type: 'boolean', default: true })
  is_public!: boolean;

  // Not set automatically on shop creation — new shops start uncategorized
  // ('{}') until a category-picker flow exists. Existing shops were
  // backfilled to ['cafe'] via add-shop-categories.ts.
  @Column({ type: 'enum', enum: SHOP_CATEGORIES, array: true, default: '{}' })
  categories!: ShopCategory[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
