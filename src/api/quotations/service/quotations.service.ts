import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuotationDto } from '../dto/create-quotation.dto';
import { UpdateQuotationDto } from '../dto/update-quotation.dto';
import { Quotation } from '../entities/quotation.entity';

@Injectable()
export class QuotationsService {
  @InjectRepository(Quotation)
  private readonly repository: Repository<Quotation>;

  async create(createQuotationDto: CreateQuotationDto): Promise<Quotation> {
    const newQuotation = { ...createQuotationDto };

    const entity = Object.assign(new Quotation(), newQuotation);

    const quotation = await this.repository.save(entity);
    return quotation;
  }

  findAll(): Promise<Quotation[]> {
    return this.repository.find({});
  }

  findOne(id: string): Promise<Quotation> {
    return this.repository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateQuotationDto: UpdateQuotationDto,
  ): Promise<Object> {
    const quotation = await this.findOne(id);
    if (updateQuotationDto.customer)
      quotation.customer = updateQuotationDto.customer;
    if (updateQuotationDto.status) quotation.status = updateQuotationDto.status;
    await this.repository.save(quotation);
    return { message: 'quotation updated successfully', data: quotation };
  }

  async remove(id: string) {
    const quotation = await this.findOne(id);

    await this.repository.delete(quotation.id);
    return {
      message: `quotation with the id ${quotation.id} deleted successfully`,
    };
  }

  async getLastRecord(): Promise<Quotation> {
    return this.repository.findOne({
      order: { createdDate: 'DESC' },
    });
  }

  async countAll(): Promise<number> {
    return this.repository.count();
  }
}
