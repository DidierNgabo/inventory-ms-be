import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateQuotationDetailsDto {
  @IsNotEmpty()
  productName: string;
  @IsNotEmpty()
  @IsNumber()
  unityCost: number;
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
  @IsNotEmpty()
  @IsUUID()
  quotation: string;
}
