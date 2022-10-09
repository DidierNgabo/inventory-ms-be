import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateQuotationDto {
  @IsOptional()
  status: string;

  @IsNotEmpty()
  customer: string;
}
