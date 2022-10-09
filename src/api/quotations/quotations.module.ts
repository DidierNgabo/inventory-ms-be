import { Module } from '@nestjs/common';
import { QuotationsService } from './service/quotations.service';
import { QuotationsController } from './controllers/quotations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quotation } from './entities/quotation.entity';
import { QuotationDetailsService } from './service/quotation-details.service';
import { QuotationDetailsController } from './controllers/quotation-details.controller';
import { QuotationDetails } from './entities/quotation.details.entity';
import { UserModule } from '../users/user.module';

@Module({
  controllers: [QuotationsController, QuotationDetailsController],
  imports: [TypeOrmModule.forFeature([Quotation, QuotationDetails]),UserModule],
  providers: [QuotationsService, QuotationDetailsService],
})
export class QuotationModule {}
