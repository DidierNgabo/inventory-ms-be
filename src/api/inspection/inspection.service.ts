import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { Inspection } from './entities/inspection.entity';
import PDFDocument from 'pdfkit-table';

@Injectable()
export class InspectionService {
  @InjectRepository(Inspection)
  private readonly repo: Repository<Inspection>;

  create(dto: CreateInspectionDto, user: User): Promise<Inspection> {
    const inspection = new Inspection();
    inspection.problem = dto.problem;
    inspection.comment = dto.comment;
    inspection.doneBy = user;
    return this.repo.save(inspection);
  }

  findAll(): Promise<Inspection[]> {
    return this.repo.find({
      relations: {
        doneBy: true,
      },
    });
  }

  findOne(id: string): Promise<Inspection> {
    return this.repo.findOne({ where: { id } });
  }

  async update(
    id: string,
    dto: UpdateInspectionDto,
    user: number,
  ): Promise<Inspection> {
    const inspection = await this.findInspection({
      where: { id: id, doneBy: { id: user } },
    });
    const updatedInspection = Object.assign(inspection, dto);
    return this.repo.save(updatedInspection);
  }

  async remove(id: string, user: number): Promise<Object> {
    const inspection = await this.findInspection({
      where: {
        id: id,
        doneBy: {
          id: user,
        },
      },
    });
    await this.repo.delete(inspection.id);
    return { message: ` Inspection  #${inspection.id} deleted Successfully` };
  }

  async findInspection(options: any) {
    const inspection = await this.repo.findOne(options);
    if (!inspection) throw new NotFoundException('Inspection not found');
    else return inspection;
  }

  async generatePDF(): Promise<Buffer> {
    const data: any = await this.findAll();
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        margin: 30,
        size: 'A4',
      });

      (async function () {
        // table
        const table = {
          title: 'Inspections',
          subtitle: 'List of inspections Saved',
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
              label: 'Problem',
              width: 100,
              property: 'problem',
              renderer: null,
            },
            {
              label: 'Comment',
              property: 'comment',
              width: 150,
              renderer: null,
            },
            {
              label: 'Status',
              width: 150,
              property: 'status',
              renderer: (value, i, irow) => `${value}`,
            },
            {
              label: 'Done By',
              width: 150,
              property: 'doneBy',
              renderer: (value: User, i, irow) => `${value.name}`,
            },
          ],
          datas: data,
        };
        await doc.table(table, {
          width: 600,
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
}
