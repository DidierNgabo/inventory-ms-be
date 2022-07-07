import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuotationDetails } from './quotation.details.entity';

@Entity('quotations')
export class Quotation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', nullable: false })
  status: string;
  @Column({ type: 'varchar', nullable: false })
  quotationNumber: string;
  @Column({ type: 'varchar', nullable: false })
  customer: string;
  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @OneToMany(() => QuotationDetails, (detail) => detail.quotation)
  quotation_details: QuotationDetails[];

  @BeforeInsert()
  async generateQuotationNumber() {
    const lastRecord = await Quotation.find({
      order: { createdDate: 'DESC' },
      take: 1,
    });
    let previousNumber: string | null = null;

    if (lastRecord) {
      previousNumber = lastRecord[0].quotationNumber;
    }
    if (previousNumber === null) {
      this.quotationNumber = 'QUOTE_0001';
    } else {
      let pad = previousNumber.split('_')[1];
      let increment = parseInt(pad) + 1;
      let nextNumber = increment.toString().padStart(4, '0');
      this.quotationNumber = `QUOTE_${nextNumber}`;
    }
  }
}
