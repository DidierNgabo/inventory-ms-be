import { PartialType } from '@nestjs/swagger';
import { RegisterDto } from '../auth/auth.dto';

export class UpdateUserDto extends PartialType(RegisterDto) {}


