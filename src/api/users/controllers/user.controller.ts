import { Public } from '@/common/helper/PublicDecorator';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { RegisterDto } from '../auth/auth.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UpdateUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  @Inject(UserService)
  private readonly service: UserService;

  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  public findAll() {
    return this.service.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('verify/:id')
  @Public()
  public verify(@Param('id') id: number) {
    return this.service.verify(id);
  }

  @Get('/role/:name')
  public countByrole(@Param('name') role: string) {
    return this.service.countByRole(role);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  public findById(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  private update(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.service.update(+id, body);
  }

  @Delete(':id')
  private delete(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
