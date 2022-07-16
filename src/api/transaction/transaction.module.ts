import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { ProductsModule } from '../products/products.module';
import { UserModule } from '../users/user.module';
@Module({
  controllers: [TransactionController],
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    ProductsModule,
    UserModule,
  ],
  providers: [TransactionService],
})
export class TransactionModule {}
