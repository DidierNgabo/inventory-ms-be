import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Quotation } from './quotation.entity';

@Entity('quotation_details')
export class QuotationDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', nullable: false })
  productName: string;
  @Column({ type: 'bigint', nullable: false })
  unityCost: number;
  @Column({ type: 'int', nullable: false })
  quantity: number;
  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @ManyToOne(() => Quotation, (quotation) => quotation.id)
  quotation: Quotation;
}
