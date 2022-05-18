import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  email!: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar' })
  password!: string;

  @Column({ type: 'varchar', nullable: true })
  public name: string | null;

  @Column({ default: false })
  public isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  public lastLoginAt: Date | null;
}
