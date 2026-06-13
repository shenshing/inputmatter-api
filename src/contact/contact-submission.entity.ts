import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ContactStatus =
  | 'pending'
  | 'following'
  | 'success'
  | 'fail'
  | 'no-reply'
  | 'feature-dev';

@Entity('contact_submissions')
export class ContactSubmission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  category!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar', nullable: true })
  shopName!: string | null;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  contactInfo!: string;

  @Column({ type: 'varchar', default: 'pending' })
  status!: ContactStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
