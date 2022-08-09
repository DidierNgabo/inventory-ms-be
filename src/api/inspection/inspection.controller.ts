import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { InspectionService } from './inspection.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { AuthUser } from '@/common/helper/UserDecorator';
import { User } from '../users/entities/user.entity';
import { Response } from 'express';

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

  @Get('/pdf')
  async getPDF(@Res() res: Response): Promise<void> {
    const buffer = await this.inspectionService.generatePDF();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=example.pdf',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
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
