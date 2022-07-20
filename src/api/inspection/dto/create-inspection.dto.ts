import { IsNotEmpty, IsString } from 'class-validator';

export class CreateInspectionDto {
  @IsString()
  @IsNotEmpty()
  problem: string;
  @IsString()
  @IsNotEmpty()
  comment: string;
}
