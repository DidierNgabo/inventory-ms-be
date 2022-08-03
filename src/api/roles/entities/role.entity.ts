import { Permission } from '@/api/users/entities/permission.entity';
import { User } from '@/api/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToMany(() => Permission)
  @JoinTable({ name: 'role_permissions' })
  permissions: Permission[];
}
