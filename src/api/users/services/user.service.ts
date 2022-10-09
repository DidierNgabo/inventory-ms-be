import { RoleService } from '@/api/roles/roles.service';
import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { RegisterDto } from '../auth/auth.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UpdateUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

@Injectable()
@UseGuards(JwtAuthGuard)
export class UserService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  constructor(private readonly roleService: RoleService) {}

  public async findAll(): Promise<User[]> {
    return this.repository.find({ relations: { role: true } });
  }

  public async findOne(id: number): Promise<User> {
    return this.repository.findOne({
      where: { id },
      relations: { role: true },
    });
  }

  public async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  public async verify(id: number): Promise<Object> {
    const user = await this.findOne(id);
    user.isActive = true;
    await this.repository.save(user);

    return { message: 'user verified successfully' };
  }

  public async update(id: number, body: UpdateUserDto): Promise<User> {
    const user: User = await this.findOne(id);

    if (!user) throw new NotFoundException('user not found');

    if (body.name) user.name = body.name;

    if(body.isActive) user.isActive = body.isActive

    if (body.role) {
      const role = await this.roleService.findOne(body.role);
      user.role = role;
    }
    return this.repository.save(user);
  }

  public async countByRole(role: string): Promise<Object> {
    return this.repository.count({
      where: { role: { name: role.toLowerCase() } },
    });
  }
}
