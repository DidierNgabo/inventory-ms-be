import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto, UpdateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  @InjectRepository(Role)
  private readonly repository: Repository<Role>;

  public async create(body: CreateRoleDto): Promise<Object> {
    const role = await this.repository.save(body);
    return { message: 'Role created successfully', data: role };
  }

  public async findAll(): Promise<Role[]> {
    return this.repository.find();
  }

  public async findOne(id: number): Promise<Role> {
    return this.repository.findOneBy({ id });
  }

  public async remove(id: number): Promise<Object> {
    await this.repository.delete(id);

    return { message: 'Role deleted Successfully' };
  }

  public async update(id: number, body: UpdateRoleDto): Promise<Object> {
    const role = await this.repository.findOneByOrFail({ id });

    if (body.name) role.name = body.name;
    if (body.description) role.description = body.description;

    const updated = await this.repository.save(role);

    return { message: 'Role updated successfully', data: updated };
  }
}
