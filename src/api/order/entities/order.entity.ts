import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'orders' })
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  orderNumber: string;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'varchar' })
  customer: string;

  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;

  @BeforeInsert()
  async generateQuotationNumber() {
    const lastRecord = await Order.find({
      order: { createdDate: 'DESC' },
      take: 1,
    });
    let previousNumber: string | null = null;

    if (lastRecord.length > 0) {
      console.log('in here');
      previousNumber = lastRecord[0].orderNumber;
    }
    if (previousNumber === null) {
      this.orderNumber = 'ORDER_0001';
    } else {
      let pad = previousNumber.split('_')[1];
      let increment = parseInt(pad) + 1;
      let nextNumber = increment.toString().padStart(4, '0');
      this.orderNumber = `ORDER_${nextNumber}`;
    }
  }
}
