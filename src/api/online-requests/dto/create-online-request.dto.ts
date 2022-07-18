import { IsNotEmpty, IsString } from 'class-validator';

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
}
