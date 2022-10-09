import { User } from '@/api/users/entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFullQuotationDto } from '../dto/create-fullQuotation.dto';
import { CreateQuotationDetailsDto } from '../dto/create-quotation.details.dto';
import { UpdateQuotationDetailsDto } from '../dto/update-quotation.details.dto';
import { QuotationDetails } from '../entities/quotation.details.entity';
import { Quotation } from '../entities/quotation.entity';
import { QuotationsService } from './quotations.service';

@Injectable()
export class QuotationDetailsService {
  constructor(
    @InjectRepository(QuotationDetails)
    private readonly repository: Repository<QuotationDetails>,
    private readonly quotationService: QuotationsService,
  ) {}

  async create(dto: CreateQuotationDetailsDto): Promise<Object> {
    const quotation = await this.quotationService.findOne(dto.quotation);

    if (!quotation) {
      throw new NotFoundException('quotation not found');
    }

    const quotationDetails = new QuotationDetails();

    quotationDetails.productName = dto.productName;
    quotationDetails.quantity = dto.quantity;
    quotationDetails.unityCost = dto.unityCost;
    quotationDetails.quotation = quotation;

    const detail = await this.repository.save(quotationDetails);

    return { message: 'Quotation created Successully', data: detail };
  }

  async findAll(): Promise<QuotationDetails[]> {
    return this.repository.find({
      relations: {
        quotation: true,
      },
    });
  }

  findOne(id: string): Promise<QuotationDetails> {
    return this.repository.findOne({ where: { id } });
  }

  async findByQuotation(id: string): Promise<QuotationDetails[]> {

    return this.repository.find({
      relations: {
        quotation: true,
      },
      where: {
        quotation: {
          id,
        },
      },
    });
  }

  async update(id: string, dto: UpdateQuotationDetailsDto): Promise<Object> {
    const quotationDetails = await this.findOne(id);

    if (dto?.productName) quotationDetails.productName = dto.productName;
    if (dto?.quantity) quotationDetails.quantity = dto.quantity;
    if (dto?.unityCost) quotationDetails.unityCost = dto.unityCost;

    const updatedQuotationDetails = await this.repository.save(
      quotationDetails,
    );

    return {
      message: 'quotation details update successfully',
      data: updatedQuotationDetails,
    };
  }

  async remove(id: string) {
    const quotationDetail = await this.findOne(id);

    await this.repository.delete(quotationDetail.id);
    return {
      message: `quotation with the id ${quotationDetail.id} deleted successfully`,
    };
  }

  async createQuotationAndQuotationDetails(
    dto: CreateFullQuotationDto,
  ): Promise<Object> {
    
    const quotation = {
      status: dto.status,
      customer: dto.customer,
    };

   
    let savedQuotation = await this.quotationService.create(quotation);

    if (savedQuotation) {
      dto.details.forEach((detail) => {
        const quotationDetail = {
          productName: detail.productName,
          unityCost: detail.unityCost,
          quantity: detail.quantity,
          quotation: savedQuotation.id,
        };

        this.create(quotationDetail);
      });
    }

    return { message: 'Quotation saved successfully' };
  }
}
