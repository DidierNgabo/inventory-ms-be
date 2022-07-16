import { Product } from '@/api/products/entities/product.entity';
import { User } from '@/api/users/entities/user.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transactions')
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  transactionNo: string;

  @Column({ type: 'varchar', nullable: false })
  type: string;

  @OneToOne(() => Product, (product) => product.id)
  @JoinColumn()
  product: Product;

  @Column({ nullable: false })
  quantity: number;

  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;

  @OneToOne(() => User, (user) => user.name)
  @JoinColumn()
  createdby: User;

  @BeforeInsert()
  async generateQuotationNumber() {
    const lastRecord = await Transaction.find({
      order: { createdDate: 'DESC' },
      take: 1,
    });
    let previousNumber: string | null = null;

    if (lastRecord.length > 0) {
      console.log('in here');
      previousNumber = lastRecord[0].transactionNo;
    }
    if (previousNumber === null) {
      this.transactionNo = 'TR_0001';
    } else {
      let pad = previousNumber.split('_')[1];
      let increment = parseInt(pad) + 1;
      let nextNumber = increment.toString().padStart(4, '0');
      this.transactionNo = `TR_${nextNumber}`;
    }
  }
}
