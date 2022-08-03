import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Address } from '../entities/address.interface';

export class CreateOnlineRequestDto {
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsString()
  @IsNotEmpty()
  service: string;
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  address: Address;

  @IsOptional()
  @IsNumber()
  assignedTo: number;
}
