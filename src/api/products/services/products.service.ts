import { CategoriesService } from '@/api/categories/categories.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
    private categoryService: CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Object> {
    const category = await this.categoryService.findOne(
      createProductDto.categoryId,
    );

    if (!category) {
      return {
        message: `category with ${createProductDto.categoryId} not found`,
      };
    }

    delete createProductDto.categoryId;

    const newProduct = {
      ...createProductDto,
      category,
    };

    const product = await this.repository.save(newProduct);
    return { message: 'Product saved successfully', data: product };
  }

  findAll(): Promise<Product[]> {
    return this.repository.find({
      relations: {
        category: true,
      },
    });
  }

  findOne(id: string): Promise<Product> {
    return this.repository.findOne({
      relations: { category: true },
      where: { id },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (updateProductDto.name) product.name = updateProductDto.name;
    if (updateProductDto.amountInStock)
      product.amountInStock = updateProductDto.amountInStock;
    if (updateProductDto.maximumStock)
      product.maximumStock = updateProductDto.maximumStock;
    if (updateProductDto.reorderQuantity)
      product.reorderQuantity = updateProductDto.reorderQuantity;
    if (updateProductDto.vat) product.vat = updateProductDto.vat;
    if (updateProductDto.warranty) product.warranty = updateProductDto.warranty;

    await this.repository.save(product);

    return { message: 'Product update successfully', data: product };
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    await this.repository.delete(product.id);

    return {
      message: `product with the name of '${product.name}' deleted successfully`,
    };
  }

  async countAll(): Promise<number> {
    return this.repository.count();
  }
}
