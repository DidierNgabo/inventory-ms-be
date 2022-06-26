import { type } from 'os';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuotationDetails } from './quotation.details.entity';

@Entity('quotations')
export class Quotation {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', nullable: false })
  status: string;
  @Column({ type: 'varchar', nullable: false })
  customer: string;
  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @OneToMany(() => QuotationDetails, (detail) => detail.quotation)
  quotation_details: QuotationDetails[];
}
