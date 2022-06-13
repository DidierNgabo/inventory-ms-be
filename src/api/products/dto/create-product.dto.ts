import { CreateCategoryDto } from '@/api/categories/dto/create-category.dto';
import { Category } from '@/api/categories/entities/category.entity';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsNumber()
  amountInStock: number;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  @IsNumber()
  maximumStock: number;
  @IsBoolean()
  @IsNotEmpty()
  vat: boolean;
  @IsNotEmpty()
  warranty: string;
  @IsNotEmpty()
  @IsNumber()
  reorderQuantity: number;
  @IsNotEmpty()
  categoryId: string;
}
