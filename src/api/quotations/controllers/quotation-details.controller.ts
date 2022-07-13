import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateFullQuotationDto } from '../dto/create-fullQuotation.dto';
import { CreateQuotationDetailsDto } from '../dto/create-quotation.details.dto';
import { UpdateQuotationDetailsDto } from '../dto/update-quotation.details.dto';
import { QuotationDetailsService } from '../service/quotation-details.service';

@ApiTags('quotation-details')
@Controller('quotation-details')
export class QuotationDetailsController {
  constructor(
    private readonly quotationDetailsService: QuotationDetailsService,
  ) {}

  @Post()
  create(@Body() createQuotationDto: CreateQuotationDetailsDto) {
    return this.quotationDetailsService.create(createQuotationDto);
  }

  @Post('full')
  createFull(@Body() dto: CreateFullQuotationDto) {
    return this.quotationDetailsService.createQuotationAndQuotationDetails(dto);
  }

  @Get()
  findAll() {
    return this.quotationDetailsService.findAll();
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuotationDetailsDto: UpdateQuotationDetailsDto,
  ) {
    return this.quotationDetailsService.update(id, updateQuotationDetailsDto);
  }

  @Get(':id')
  findOne(id: string) {
    return this.quotationDetailsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quotationDetailsService.remove(id);
  }
}
