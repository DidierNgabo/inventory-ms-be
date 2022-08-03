import { Inspection } from '@/api/inspection/entities/inspection.entity';
import { OnlineRequest } from '@/api/online-requests/entities/online-request.entity';
import { Role } from '@/api/roles/entities/role.entity';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  email: string;

  @Exclude()
  @Column({ type: 'varchar' })
  password: string;

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

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @OneToMany(() => OnlineRequest, (request) => request.customer)
  requests: OnlineRequest[];
  @OneToMany(() => OnlineRequest, (request) => request.assignedTo)
  assignedRequests: OnlineRequest[];

  @OneToMany(() => Inspection, (inspection) => inspection.id)
  inspections: Inspection[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
