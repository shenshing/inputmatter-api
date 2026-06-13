import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('subscription_quota')
export class SubscriptionQuota {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  shopId!: number;

  @Column()
  subscriptionId!: number;

  @Column({ type: 'int', default: 0 })
  count!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
