import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PDFDocument from 'pdfkit-table';
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
      message: `quotation with the id ${quotation.quotationNumber} deleted successfully`,
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

  async countByStatus(): Promise<Object> {
    const approved = await this.repository.count({
      where: { status: 'Approved' },
    });
    const rejected = await this.repository.count({
      where: { status: 'created' },
    });
    const accepted = await this.repository.count({
      where: { status: 'accepted' },
    });

    return { approved, rejected, accepted };
  }

  async generatePDF(): Promise<Buffer> {
    const quotations: any = await this.findAll();
    const data = quotations.map(
      ({ id, updatedDate, ...quotation }) => quotation,
    );
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        margin: 30,
        size: 'A4',
      });

      (async function () {
        // table
        const table = {
          title: 'Quotations',
          subtitle: 'Subtitle',
          headers: [
            {
              label: 'No',
              property: 'quotationNumber',
              width: 60,
              renderer: null,
            },
            {
              label: 'Customer',
              property: 'customer',
              width: 150,
              renderer: null,
            },
            { label: 'Status', property: 'status', width: 100, renderer: null },
            {
              label: 'Date',
              property: 'createdDate',
              width: 100,
              renderer: null,
            },
          ],
          datas: data,
        };
        // A4 595.28 x 841.89 (portrait) (about width sizes)
        // width
        await doc.table(table, {
          width: 300,
        });
        // or columnsSize
        // await doc.table(table, {
        //   columnsSize: [200, 100, 100],
        // });
        // done!
        doc.end();
      })();

      // // customize your PDF document
      // doc.text('hello world', 100, 50);
      // doc.end();

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
    });

    return pdfBuffer;
  }
}
