import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDetailDto } from './create-product-detail.dto';

export class UpDateProductDetailDto extends PartialType(
  CreateProductDetailDto,
) {}
