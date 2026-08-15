import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Shop } from '../shop/shop.entity';

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'int', nullable: true })
  rating!: number | null;

  @Column({ type: 'jsonb' })
  categories!: string[];

  @Column({ type: 'varchar', length: 20, nullable: true, default: 'web' })
  source!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  image_urls!: string[] | null;

  @Column({ type: 'boolean', default: true })
  is_public!: boolean;

  // Catch-all for data that comes with a feedback record but has no column of
  // its own — e.g. for feedback imported from Google Maps: author_name,
  // relative_date ("2 years ago", not a real timestamp), likes_count, owner_reply.
  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, unknown> | null;

  @Column({ type: 'text' })
  shop_name!: string;

  @ManyToOne(() => Shop, { eager: true, nullable: true })
  @JoinColumn({ name: 'shop_id' })
  shop!: Shop | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
