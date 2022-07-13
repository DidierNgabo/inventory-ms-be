import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { CategoriesModule } from './categories/categories.module';
import { QuotationModule } from './quotations/quotations.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [UserModule, CategoriesModule, QuotationModule, OrderModule],
})
export class ApiModule {}
