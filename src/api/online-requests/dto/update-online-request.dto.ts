import { PartialType } from '@nestjs/swagger';
import { CreateOnlineRequestDto } from './create-online-request.dto';

export class UpdateOnlineRequestDto extends PartialType(CreateOnlineRequestDto) {}
