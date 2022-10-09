import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { UpdateQuotationDetailsDto } from './update-quotation.details.dto';

export class CreateFullQuotationDto {
  @IsOptional()
  status: string;
  @IsNotEmpty()
  customer: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => UpdateQuotationDetailsDto)
  details: UpdateQuotationDetailsDto[];
}
