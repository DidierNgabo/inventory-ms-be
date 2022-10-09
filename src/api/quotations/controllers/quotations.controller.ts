import { User } from '@/api/users/entities/user.entity';
import { Public } from '@/common/helper/PublicDecorator';
import { AuthUser } from '@/common/helper/UserDecorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateQuotationDto } from '../dto/create-quotation.dto';
import { UpdateQuotationDto } from '../dto/update-quotation.dto';
import { QuotationsService } from '../service/quotations.service';

@ApiTags('quotations')
@Controller('quotations')
@Public()
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Post()
  create(@Body() createQuotationDto: CreateQuotationDto) {
    
    return this.quotationsService.create(createQuotationDto);
  }

  @Get()
  findAll(@AuthUser() user: User) {
    return this.quotationsService.findAll(user);
  }

  @Get('status/count')
  countByStatus() {
    return this.quotationsService.countByStatus();
  }

  @Get('count')
  countAll() {
    return this.quotationsService.countAll();
  }

  @Get('/pdf')
  async getPDF(@Res() res: Response,@AuthUser() user: User): Promise<void> {
    const buffer = await this.quotationsService.generatePDF(user);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=quotations.pdf',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  @Get('/pdf/:id')
  async getSinglePDF(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<void> {
    const buffer = await this.quotationsService.generatePdfForSingle(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=example.pdf',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotationsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuotationDto: UpdateQuotationDto,
  ) {
    return this.quotationsService.update(id, updateQuotationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quotationsService.remove(id);
  }
}
