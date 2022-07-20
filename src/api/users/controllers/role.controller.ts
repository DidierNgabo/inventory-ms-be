import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto, UpdateRoleDto } from '../dtos/role.dto';
import { RoleService } from '../services/role.service';

@ApiBearerAuth()
@ApiTags('roles')
@Controller('roles')
export class RoleController {
  @Inject(RoleService)
  private readonly roleService: RoleService;

  @Post()
  public async create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Get()
  public async findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }

  @Delete(':id')
  public async delete(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.remove(id);
  }

  @Put(':id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, dto);
  }
}
