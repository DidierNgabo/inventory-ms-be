import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public readonly name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
