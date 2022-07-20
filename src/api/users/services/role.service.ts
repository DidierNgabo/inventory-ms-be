import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto, UpdateRoleDto } from '../dtos/role.dto';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleService {
  @InjectRepository(Role)
  private readonly repository: Repository<Role>;

  public async create(body: CreateRoleDto): Promise<Role> {
    return this.repository.save(body);
  }

  public async findAll(): Promise<Role[]> {
    return this.repository.find();
  }

  public async findOne(id: number): Promise<Role> {
    return this.repository.findOneBy({ id });
  }

  public async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  public async update(id: number, body: UpdateRoleDto): Promise<Role> {
    const role = await this.repository.findOneByOrFail({ id });

    if (body.name) role.name = body.name;
    if (body.description) role.description = body.description;

    return this.repository.save(role);
  }
}
