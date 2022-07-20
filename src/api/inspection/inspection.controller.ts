import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InspectionService } from './inspection.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { AuthUser } from '@/common/helper/UserDecorator';
import { User } from '../users/entities/user.entity';

@Controller('inspections')
export class InspectionController {
  constructor(private readonly inspectionService: InspectionService) {}

  @Post()
  create(
    @Body() createInspectionDto: CreateInspectionDto,
    @AuthUser() user: User,
  ) {
    return this.inspectionService.create(createInspectionDto, user);
  }

  @Get()
  findAll() {
    return this.inspectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inspectionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInspectionDto: UpdateInspectionDto,
    @AuthUser() tech: User,
  ) {
    return this.inspectionService.update(id, updateInspectionDto, tech.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() tech: User) {
    return this.inspectionService.remove(id, tech.id);
  }
}
