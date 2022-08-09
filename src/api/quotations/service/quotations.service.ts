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
    return this.repository.findOne({
      where: { id },
      relations: { quotation_details: true },
    });
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
          subtitle: 'List of quotations saved',
          headers: [
            {
              label: '#',
              property: '#',
              width: 50,
              renderer: function (value, i, irow) {
                return `${1 + irow}`;
              },
            },
            {
              label: 'No',
              width: 100,
              property: 'quotationNumber',
              renderer: null,
            },
            {
              label: 'Customer',
              property: 'customer',
              width: 200,
              renderer: null,
            },
            { label: 'Status', width: 150, property: 'status', renderer: null },
          ],
          datas: data,
        };
        await doc.table(table, {
          width: 500,
        });
        doc.end();
      })();

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
    });

    return pdfBuffer;
  }

  async generatePdfForSingle(id: string): Promise<Buffer> {
    const quotation = await this.findOne(id);

    const data: any = quotation.quotation_details.map(
      ({ createdDate, updatedDate, id, quotation, ...detail }) => {
        return { ...detail, total: detail.quantity * detail.unityCost };
      },
    );

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'A4',
        bufferPages: true,
      });

      // customize your PDF document
      doc.font('Times-Roman');
      doc.fillColor('#2291FF').fontSize(20).text('Services Quotation', 50, 50);
      doc
        .fillColor('#2291FF')
        .font('Times-Bold')
        .fontSize(18)
        .text('Anik Rwanda', 0, 50, {
          align: 'right',
        });

      doc
        .fillColor('#232323')
        .font('Times-Bold')
        .fontSize(12)
        .text(`Quotation No:${quotation.quotationNumber}`, 0, 100, {
          align: 'right',
        });
      doc
        .fillColor('#232323')
        .font('Times-Bold')
        .fontSize(12)
        .text(`Date:${quotation.createdDate.toLocaleDateString()}`, {
          align: 'right',
        });
      // let table = { width: 180, fontSize: 10, font: 'Courier', rows: [{ height: 10,  color: '#FFFFFF', fillColor: "#0D345A", columns: [{ text: "N°", textOptions: { "fill": "#FFFFFF"  tried "color"/"textColor"/"fillColor": "#FFFFFF" but nothing worked }, width: 20 }, { text: "Description", textOptions: { "fill": "#FFFFFF" }, width: 40 }, { text: "Qté", textOptions: { "fill": "#FFFFFF" }, width: 20 }, { text: "Unité", textOptions: { "fill": "#FFFFFF" }, width: 20 }, { text: "Prix", textOptions: { "fill": "#FFFFFF" }, width: 20 }, { text: "Rabais", textOptions: { "fill": "#FFFFFF" }, width: 20 }, { text: "TVA", textOptions: { "fill": "#FFFFFF" }, width: 20 }, { text: "Total", textOptions: { "fill": "#FFFFFF" }, width: 25 }] }] };
      //doc.table(table);

      (async function () {
        // table
        const table = {
          headers: [
            {
              label: 'Product',
              property: 'productName',
              width: 200,
              renderer: null,
            },
            {
              label: 'Quantity',
              property: 'quantity',
              width: 100,
              renderer: null,
            },
            {
              label: 'Unit Price',
              property: 'unityCost',
              width: 100,
              renderer: null,
            },
            {
              label: 'Total',
              property: 'total',
              width: 100,
              renderer: null,
            },
          ],
          datas: data,
        };
        await doc.table(table, {
          width: 500,
          y: 200,
        });
      })();

      (async function () {
        // table
        const Totaltable = {
          headers: ['Title', 'price'],
          rows: [
            ['SubTotal', '34000'],
            ['Vat', '18%'],
            ['Total', '45000'],
          ],
        };
        // A4 595.28 x 841.89 (portrait) (about width sizes)
        // width
        await doc.table(Totaltable, {
          width: 300,
          hideHeader: true,
        });
      })();

      doc.end();

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
