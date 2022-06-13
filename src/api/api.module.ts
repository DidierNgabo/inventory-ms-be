import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { CategoriesModule } from './categories/categories.module';
import { QuotationModule } from './quotations/quotations.module';

@Module({
  imports: [UserModule, CategoriesModule, QuotationModule],
})
export class ApiModule {}
