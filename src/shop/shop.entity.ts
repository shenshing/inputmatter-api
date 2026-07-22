import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type Plan = 'free' | 'basic' | 'standard' | 'plus';

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

  @Column({ type: 'boolean', default: true })
  is_public!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
