import { Category } from '@/api/categories/entities/category.entity';
import { Transaction } from '@/api/transaction/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductDetail } from './product-detail.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ nullable: false, name: 'amount_in_stock' })
  amountInStock: number;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ nullable: false, name: 'maximum_stock' })
  maximumStock: number;

  @Column({ type: 'boolean', nullable: false })
  vat: boolean;

  @Column({ type: 'varchar', nullable: false })
  warranty: string;

  @Column({ nullable: false })
  reorderQuantity: number;

  @ManyToOne(() => Category, (category) => category.id)
  category: Category;

  @OneToMany(() => ProductDetail, (productDetail) => productDetail.product)
  details: ProductDetail[];
  @OneToMany(() => Transaction, (transaction) => transaction.product)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
