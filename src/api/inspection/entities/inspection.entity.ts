import { User } from '@/api/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('inspections')
export class Inspection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  problem: string;

  @Column({ type: 'varchar', nullable: false, default: 'created' })
  status: string;

  @Column({ type: 'varchar', nullable: false })
  comment: string;

  @ManyToOne(() => User, (user) => user.inspections)
  @JoinColumn()
  doneBy: User;
  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
}
