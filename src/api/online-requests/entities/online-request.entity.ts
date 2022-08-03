import { User } from '@/api/users/entities/user.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Address } from './address.interface';

@Entity('online_requests')
export class OnlineRequest extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', nullable: false })
  reqNo: string;

  @Column({ type: 'varchar', nullable: false })
  service: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: false })
  status: string;

  @ManyToOne(() => User, (customer) => customer.requests)
  @JoinColumn()
  customer: User;

  @Column({ type: 'jsonb', nullable: true })
  address: Address;

  @ManyToOne(() => User, (tech) => tech.assignedRequests)
  @JoinColumn()
  assignedTo: User;

  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;

  @BeforeInsert()
  async generateQuotationNumber() {
    const lastRecord = await OnlineRequest.find({
      order: { createdDate: 'DESC' },
      take: 1,
    });

    console.log(lastRecord);

    let previousNumber: string | null = null;

    if (lastRecord.length > 0) {
      previousNumber = lastRecord[0].reqNo;
    }
    if (previousNumber === null) {
      this.reqNo = 'REQ_0001';
    } else {
      let pad = previousNumber.split('_')[1];
      let increment = parseInt(pad) + 1;
      let nextNumber = increment.toString().padStart(4, '0');
      this.reqNo = `REQ_${nextNumber}`;
    }
  }
}
