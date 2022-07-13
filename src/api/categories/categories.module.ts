import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { AuthModule } from '../users/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../users/auth/auth.guard';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    CategoriesService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
  imports: [TypeOrmModule.forFeature([Category]), AuthModule],
  exports: [CategoriesService],
})
export class CategoriesModule {}
