import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { UpdateQuotationDetailsDto } from './update-quotation.details.dto';

export class CreateFullQuotationDto {
  @IsNotEmpty()
  status: string;
  @IsNotEmpty()
  customer: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => UpdateQuotationDetailsDto)
  details: UpdateQuotationDetailsDto[];
}
