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
import PDFDocument from 'pdfkit-table';

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
    const updated = Object.assign(toUpdated, dto);
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

  async generatePDF(): Promise<Buffer> {
    const data: any = await this.findAll();
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        margin: 30,
        size: 'A4',
      });

      (async function () {
        // table
        const table = {
          title: 'Transactions',
          subtitle: 'List of transactions Saved',
          headers: [
            {
              label: '#',
              property: '#',
              width: 50,
              renderer: function (value, i, irow) {
                return `${1 + irow}`;
              },
            },
            {
              label: 'No',
              width: 50,
              property: 'transactionNo',
              renderer: null,
            },
            {
              label: 'Type',
              property: 'type',
              width: 100,
              renderer: null,
            },
            {
              label: 'Quantity',
              width: 150,
              property: 'quantity',
              renderer: (value, i, irow) => `${value}`,
            },
            {
              label: 'Product',
              width: 150,
              property: 'product',
              renderer: null,
            },
          ],
          datas: data,
        };
        await doc.table(table, {
          width: 500,
        });
        doc.end();
      })();

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
    });

    return pdfBuffer;
  }
}
