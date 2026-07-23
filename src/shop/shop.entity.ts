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

  @Column({ type: 'varchar', nullable: true })
  google_map_url!: string | null;

  @Column({ type: 'varchar', nullable: true })
  logo_url!: string | null;

  // Named profile links — e.g. [{ name: 'tiktok', social_link: 'https://...' }].
  // Only a subset (currently Google Maps + TikTok) is actually rendered on
  // the feedback form today (see FeedbackForm.tsx); the array leaves room
  // for more platforms later without another migration.
  @Column({ type: 'jsonb', nullable: true })
  social_link!: ShopSocialLink[] | null;

  @Column({ type: 'boolean', default: true })
  is_public!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
