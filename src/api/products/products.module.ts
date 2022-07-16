import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { AuthModule } from '../users/auth/auth.module';
import { ProductDetailController } from './controllers/product-detail.controller';
import { ProductsController } from './controllers/products.controller';
import { ProductDetail } from './entities/product-detail.entity';
import { Product } from './entities/product.entity';
import { ProductDetailService } from './services/product-detail.service';
import { ProductsService } from './services/products.service';

@Module({
  controllers: [ProductsController, ProductDetailController],
  providers: [ProductsService, ProductDetailService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Product, ProductDetail]),
    CategoriesModule,
  ],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
