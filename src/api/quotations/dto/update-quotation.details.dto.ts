import { PartialType } from '@nestjs/mapped-types';
import { CreateQuotationDetailsDto } from './create-quotation.details.dto';

export class UpdateQuotationDetailsDto extends PartialType(
  CreateQuotationDetailsDto,
) {}
