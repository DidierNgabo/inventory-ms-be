import {
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { LoginDto, RegisterDto } from './auth.dto';
import { AuthHelper } from './auth.helper';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  public async register(body: RegisterDto): Promise<User | never> {
    const { name, email, password }: RegisterDto = body;

    let user: User = await this.repository.findOne({ where: { email } });

    if (user) {
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    }

    user = new User();

    user.name = name;
    user.email = email;
    user.password = this.helper.encodePassword(password);

    return this.repository.save(user);
  }

  public async login(body: LoginDto): Promise<object | never> {
    const { email, password }: LoginDto = body;
    const user: User = await this.repository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }

    this.repository.update(user.id, { lastLoginAt: new Date() });

    const token = this.helper.generateToken(user);

    const { password: pass, ...result } = user;

    return { token, ...result };
  }

  public async refresh(user: User): Promise<string> {
    this.repository.update(user.id, { lastLoginAt: new Date() });

    return this.helper.generateToken(user);
  }
}
