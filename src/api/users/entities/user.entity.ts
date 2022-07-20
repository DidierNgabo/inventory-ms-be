import { Inspection } from '@/api/inspection/entities/inspection.entity';
import { OnlineRequest } from '@/api/online-requests/entities/online-request.entity';
import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  email!: string;

  @Exclude()
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

  @ManyToOne(() => Role, (role) => role.id)
  role: Role;

  @OneToMany(() => OnlineRequest, (request) => request.id)
  requests: OnlineRequest[];

  @OneToMany(() => Inspection, (inspection) => inspection.id)
  inspections: Inspection[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
