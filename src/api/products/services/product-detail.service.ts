import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDetailDto } from '../dto/create-product-detail.dto';
import { UpDateProductDetailDto } from '../dto/update-product-detail.dto';
import { ProductDetail } from '../entities/product-detail.entity';
import { Product } from '../entities/product.entity';
import { ProductsService } from './products.service';

@Injectable()
export class ProductDetailService {
  constructor(
    @InjectRepository(ProductDetail)
    private repository: Repository<ProductDetail>,
    private readonly productService: ProductsService,
  ) {}

  async findAll(): Promise<ProductDetail[]> {
    return this.repository.find({
      relations: {
        product: true,
      },
    });
  }

  async findOne(id: string): Promise<ProductDetail> {
    const detail = await this.repository.findOne({
      relations: { product: true },
      where: { id },
    });

    if (!detail) throw new NotFoundException('detail not found');

    return detail;
  }

  async create(productDetailDTO: CreateProductDetailDto): Promise<Object> {
    const product = await this.productService.findOne(
      productDetailDTO.productId,
    );

    if (!product)
      throw new NotFoundException('product not found, please try again');

    const newProductDetail = new ProductDetail();

    newProductDetail.color = productDetailDTO.color;
    newProductDetail.price = productDetailDTO.price;
    newProductDetail.product = product;

    const detail = await this.repository.save(newProductDetail);

    return { message: 'product Detail saved Successfuly', data: detail };
  }

  async update(id: string, dto: UpDateProductDetailDto): Promise<Object> {
    const detail = await this.findOne(id);

    console.log(dto);

    if (dto?.price) detail.price = dto.price;
    if (dto?.color) detail.color = dto.color;

    console.log(detail);

    const updatedProductDetail = await this.repository.save(detail);

    return {
      message: 'product details update successfully',
      data: updatedProductDetail,
    };
  }

  async remove(id: string): Promise<Object> {
    const productDetail = await this.findOne(id);
    await this.repository.remove(productDetail);

    return { message: 'product Detail deleted successfuly' };
  }
}
