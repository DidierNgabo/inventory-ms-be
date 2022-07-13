import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDetailDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNumber()
  @IsNotEmpty()
  discount: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  order: string;
}
