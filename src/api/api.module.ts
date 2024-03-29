import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { CategoriesModule } from './categories/categories.module';
import { QuotationModule } from './quotations/quotations.module';
import { OrderModule } from './order/order.module';
import { TransactionModule } from './transaction/transaction.module';
import { ProductsModule } from './products/products.module';
import { OnlineRequestsModule } from './online-requests/online-requests.module';
import { InspectionModule } from './inspection/inspection.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    UserModule,
    CategoriesModule,
    QuotationModule,
    ProductsModule,
    OrderModule,
    TransactionModule,
    OnlineRequestsModule,
    InspectionModule,
    RolesModule,
  ],
})
export class ApiModule {}
