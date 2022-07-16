import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  type: string;
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
  product: string;
}
