import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UpdateNameDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

@Injectable()
@UseGuards(JwtAuthGuard)
export class UserService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  public async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  public async findOne(id: number): Promise<User> {
    return this.repository.findOneBy({ id });
  }

  public async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  public async updateName(body: UpdateNameDto, req: Request): Promise<User> {
    const user: User = <User>req.user;

    user.name = body.name;

    return this.repository.save(user);
  }
}