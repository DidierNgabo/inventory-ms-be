import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  type: string;
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
  @IsNotEmpty()
  @IsUUID()
  product: string;
}
