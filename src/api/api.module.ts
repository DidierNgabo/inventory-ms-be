import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [UserModule, CategoriesModule],
})
export class ApiModule {}
