import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductsService } from '../products/services/products.service';
import { User } from '../users/entities/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly productService: ProductsService,
  ) {}

  async create(dto: CreateTransactionDto, user: User): Promise<Transaction> {
    const product = await this.productService.findOne(dto.product);

    const transaction = new Transaction();
    transaction.quantity = dto.quantity;
    transaction.type = dto.type;
    transaction.product = product;
    transaction.createdby = user;

    if (
      transaction.type === 'stock out' &&
      transaction.quantity > product.amountInStock
    ) {
      throw new BadRequestException(
        'quantity can not be greater than amount in stock',
      );
    }

    this.updateProductAmount(transaction, product);

    return this.repo.save(transaction);
  }

  findAll() {
    return this.repo.find({
      relations: {
        product: true,
      },
    });
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.repo.findOne({
      where: { id },
      relations: {
        product: true,
      },
    });
    return transaction;
  }

  async update(id: string, dto: UpdateTransactionDto) {
    const toUpdated = await this.findOne(id);

    console.log(toUpdated);

    const updated = Object.assign(toUpdated, dto);

    console.log(updated);

    if (
      updated.type === 'stock out' &&
      updated.quantity > updated.product.amountInStock
    ) {
      throw new BadRequestException(
        'quantity can not be greater than amount in stock',
      );
    }

    this.updateProductAmount(updated, updated.product);

    return await this.repo.save(updated);
  }

  async updateProductAmount(transaction: Transaction, product: Product) {
    product.amountInStock =
      transaction.type === 'stock out'
        ? product.amountInStock - transaction.quantity
        : product.amountInStock + transaction.quantity;

    await this.productRepo.save(product);
  }

  async remove(id: string) {
    const transaction = await this.findOne(id);

    if (!transaction) {
      throw new NotFoundException('transaction not found');
    }

    await this.repo.remove(transaction);

    return { message: `Deleted successfully #${id} transaction` };
  }

  async countAll(): Promise<number> {
    return this.repo.count();
  }
}
