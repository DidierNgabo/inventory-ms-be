import { Trim } from 'class-sanitizer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
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

  @IsBoolean()
  @IsOptional()
  public readonly isActive:boolean;

  @IsString()
  @IsNotEmpty()
  public role: number;
}

export class LoginDto {
  @IsEmail()
  @Trim()
  public readonly email: string;

  @IsString()
  public readonly password: string;
}

export class ResetDto {
  @IsString()
  @IsNotEmpty()
  public readonly oldPassword: string;
  @IsString()
  @IsNotEmpty()
  public readonly newPassword: string;
}
