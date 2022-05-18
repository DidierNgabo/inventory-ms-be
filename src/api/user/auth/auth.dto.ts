import { Trim } from 'class-sanitizer';
import {
  IsEmail,
  isEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @Trim()
  @IsEmail()
  public readonly email: string;

  @IsString()
  @MinLength(8)
  public readonly password: string;

  @IsString()
  @IsOptional()
  public readonly name?: string;
}

export class LoginDto {
  @IsEmail()
  @Trim()
  public readonly email: string;

  @IsString()
  public readonly password: string;
}
