import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

import { LoginDto, RegisterDto, ResetDto } from './auth.dto';
import { AuthHelper } from './auth.helper';
import { MailService } from '@/mail/mail.service';
import { RoleService } from '@/api/roles/roles.service';
import { UpdateUserDto } from '../dtos/user.dto';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  constructor(
    private mailService: MailService,
    private roleService: RoleService,
  ) {}

  public async register(body: RegisterDto): Promise<Object | never> {
    const { name, email, password }: RegisterDto = body;

    const role = await this.roleService.findOne(body.role);

    let user: User = await this.repository.findOne({ where: { email } });

    if (user) {
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    }

    user = new User({});

    user.name = name;
    user.email = email;
    user.role = role;
    user.password = this.helper.encodePassword(password);
    const newUser = await this.repository.save(user);
    return this.mailService.sendUserConfirmation(newUser);
  }

  public async login(body: LoginDto): Promise<object | never> {
    const { email, password }: LoginDto = body;
    const user: User = await this.repository.findOne({
      where: { email },
      relations: { role: true },
    });

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

    user.lastLoginAt = new Date();

    await this.repository.save(user);

    const token = this.helper.generateToken(user);

    const { password: pass, ...result } = user;

    return { token, user: { ...result } };
  }

  public async resetPassword(
    id: number,
    dto: ResetDto,
  ): Promise<Object | null> {
    const { oldPassword, newPassword }: ResetDto = dto;
    const user: User = await this.repository.findOne({
      where: { id },
      relations: { role: true },
    });

    const isPasswordValid: boolean = this.helper.isPasswordValid(
      oldPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid Credentials', HttpStatus.FORBIDDEN);
    }

    user.password = this.helper.encodePassword(newPassword);

    await this.repository.save(user);

    return { message: 'password resetted successfully' };
  }

  public async refresh(user: User): Promise<string> {
    user.lastLoginAt = new Date();

    await this.repository.save(user);
    this.repository.save(user);

    return this.helper.generateToken(user);
  }

  public async logout() {}
}
