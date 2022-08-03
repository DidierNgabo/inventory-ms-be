import { Public } from '@/common/helper/PublicDecorator';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { User } from '../entities/user.entity';
import { LoginDto, RegisterDto, ResetDto } from './auth.dto';
import { JwtAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly service: AuthService;

  @Public()
  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  private register(@Body() body: RegisterDto): Promise<Object | never> {
    return this.service.register(body);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  private login(@Body() body: LoginDto): Promise<object | never> {
    return this.service.login(body);
  }

  @Public()
  @Post('reset/:id')
  @HttpCode(HttpStatus.OK)
  private reset(
    @Param('id') id: string,
    @Body() dto: ResetDto,
  ): Promise<Object | never> {
    return this.service.resetPassword(+id, dto);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  private refresh(@Req() { user }: Request): Promise<string | never> {
    return this.service.refresh(<User>user);
  }
}
