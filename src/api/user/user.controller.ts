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
import { Request } from 'express';
import { JwtAuthGuard } from './auth/auth.guard';
import { UpdateNameDto } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  @Inject(UserService)
  private readonly service: UserService;

  @Get()
  public findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  public findById(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Put('name')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  private updateName(
    @Body() body: UpdateNameDto,
    @Req() req: Request,
  ): Promise<User> {
    return this.service.updateName(body, req);
  }

  @Delete(':id')
  private delete(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
