import { Module } from '@nestjs/common';
import { QuotationsService } from './service/quotations.service';
import { QuotationsController } from './controllers/quotations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quotation } from './entities/quotation.entity';

@Module({
  controllers: [QuotationsController],
  imports: [TypeOrmModule.forFeature([Quotation])],
  providers: [QuotationsService],
})
export class QuotationModule {}
