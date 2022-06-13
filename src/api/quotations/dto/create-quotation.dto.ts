import { IsNotEmpty } from 'class-validator';

export class CreateQuotationDto {
  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  customer: string;
}
