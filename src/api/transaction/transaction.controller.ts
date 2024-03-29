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
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthUser } from '@/common/helper/UserDecorator';
import { User } from '../users/entities/user.entity';
import { Public } from '@/common/helper/PublicDecorator';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('transactions')
@Controller('transactions')
@Public()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @AuthUser() user: User,
  ) {
    return this.transactionService.create(createTransactionDto, user);
  }

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get('/pdf')
  async getPDF(@Res() res: Response): Promise<void> {
    const buffer = await this.transactionService.generatePDF();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=example.pdf',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  @Get('count')
  countAll() {
    return this.transactionService.countAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(id);
  }
}
