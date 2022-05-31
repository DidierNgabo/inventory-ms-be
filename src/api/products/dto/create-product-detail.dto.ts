import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDetailDto {
  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @IsString()
  productId: string;
}
