import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OnlineRequestsService } from './online-requests.service';
import { CreateOnlineRequestDto } from './dto/create-online-request.dto';
import { UpdateOnlineRequestDto } from './dto/update-online-request.dto';
import { AuthUser } from '@/common/helper/UserDecorator';
import { User } from '../users/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('requests')
@ApiTags('online-requests')
export class OnlineRequestsController {
  constructor(private readonly onlineRequestsService: OnlineRequestsService) {}

  @Post()
  create(
    @Body() createOnlineRequestDto: CreateOnlineRequestDto,
    @AuthUser() user: User,
  ) {
    return this.onlineRequestsService.create(createOnlineRequestDto, user);
  }

  @Get()
  findAll() {
    return this.onlineRequestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.onlineRequestsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOnlineRequestDto: UpdateOnlineRequestDto,
  ) {
    return this.onlineRequestsService.update(id, updateOnlineRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() customer: User) {
    return this.onlineRequestsService.remove(id, customer?.id);
  }
}
