import {
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { serialize } from 'cookie';

import { LoginDto, RegisterDto } from './auth.dto';
import { AuthHelper } from './auth.helper';
import { MailService } from '@/mail/mail.service';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  constructor(private mailService: MailService) {}

  public async register(body: RegisterDto): Promise<Object | never> {
    const { name, email, password }: RegisterDto = body;

    let user: User = await this.repository.findOne({ where: { email } });

    if (user) {
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    }

    user = new User({});

    user.name = name;
    user.email = email;
    user.password = this.helper.encodePassword(password);
    const token = Math.floor(1000 + Math.random() * 9000).toString();

    return this.mailService.sendUserConfirmation(user, token);
  }

  public async login(body: LoginDto): Promise<object | never> {
    const { email, password }: LoginDto = body;
    const user: User = await this.repository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid: boolean = this.helper.isPasswordValid(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid Credentials', HttpStatus.FORBIDDEN);
    }

    this.repository.update(user.id, { lastLoginAt: new Date() });

    const token = this.helper.generateToken(user);

    const { password: pass, ...result } = user;

    return { token, user: { ...result } };
  }

  public async refresh(user: User): Promise<string> {
    this.repository.update(user.id, { lastLoginAt: new Date() });

    return this.helper.generateToken(user);
  }

  public async logout() {}
}
