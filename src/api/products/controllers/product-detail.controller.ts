import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateProductDetailDto } from '../dto/create-product-detail.dto';
import { UpDateProductDetailDto } from '../dto/update-product-detail.dto';
import { ProductDetailService } from '../services/product-detail.service';

@Controller('api/productdetails')
export class ProductDetailController {
  constructor(private readonly service: ProductDetailService) {}

  @Post()
  create(@Body() dto: CreateProductDetailDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  updateProductDetail(
    @Param('id') id: string,
    @Body() dto: UpDateProductDetailDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  deleteProductDetail(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
