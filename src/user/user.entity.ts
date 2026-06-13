import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type UserRole = 'super-admin' | 'shop-admin';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: 'varchar', nullable: true, select: false })
  passwordHash!: string | null;

  @Column({ type: 'varchar', default: 'shop-admin' })
  role!: UserRole;

  @Column({ type: 'varchar', nullable: true })
  googleId!: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;
}
