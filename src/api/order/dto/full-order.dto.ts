import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { UpdateOrderDetailDto } from './update-order-detail.dto';

export class CreateFullOrderDto {
  @IsNotEmpty()
  status: string;
  @IsNotEmpty()
  customer: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => UpdateOrderDetailDto)
  details: UpdateOrderDetailDto[];
}
