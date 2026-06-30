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
