import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('app_visitors')
export class AppVisitor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'telegram' })
  type: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
