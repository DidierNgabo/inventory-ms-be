import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserService } from '../users/services/user.service';
import { CreateOnlineRequestDto } from './dto/create-online-request.dto';
import { UpdateOnlineRequestDto } from './dto/update-online-request.dto';
import { OnlineRequest } from './entities/online-request.entity';
import PDFDocument from 'pdfkit-table';

@Injectable()
export class OnlineRequestsService {
  constructor(
    @InjectRepository(OnlineRequest)
    private readonly repo: Repository<OnlineRequest>,
    private readonly userService: UserService,
  ) {}

  create(dto: CreateOnlineRequestDto, customer: User): Promise<OnlineRequest> {
    const request = new OnlineRequest();

    request.customer = customer;
    request.description = dto.description;
    request.service = dto.service;
    request.status = dto.status;
    request.address = dto.address;
    return this.repo.save(request);
  }

  async findAll(user: User): Promise<OnlineRequest[]> {
    if (user.role.name.toLocaleLowerCase() !== 'customer') {
      return this.repo.find({
        relations: {
          customer: true,
        },
      });
    }
    return this.repo.find({
      where: {
        customer: {
          id: user.id,
        },
      },
      relations: {
        customer: true,
        assignedTo: true,
      },
    });
  }

  async findAllByStatus(user: User): Promise<OnlineRequest[]> {
    if (user.role.name === 'admin') {
      return this.repo.find({
        where:{
          status:'created'
        },
        relations: {
          customer: true,
        },
      });
    }
    return this.repo.find({
      where: {
        customer: {
          id: user.id,
        },
        status:'created',
      },
      relations: {
        customer: true,
        assignedTo: true,
      },
    });
  }

  findOne(id: string): Promise<OnlineRequest> {
    return this.repo.findOne({ where: { id }, relations: { customer: true } });
  }

  async update(
    id: string,
    dto: UpdateOnlineRequestDto,
  ): Promise<OnlineRequest> {
    const request = await this.findOne(id);
    const updatedRequest = Object.assign(request, dto);
    return this.repo.save(updatedRequest);
  }

  async remove(id: string, customer: number) {
    const request = await this.findRequest({
      where: {
        id: id,
        customer: {
          id: customer,
        },
      },
    });
    await this.repo.delete(request.id);
    return { message: ` Request  #${request.reqNo} deleted Successfully` };
  }

  async assignTech(dto: UpdateOnlineRequestDto, id: string) {
    const request = await this.findOne(id);

    const technician = await this.userService.findOne(dto.assignedTo);

    request.assignedTo = technician;

    await this.repo.save(request);

    return { message: 'technician assigned successfully' };
  }

  async findRequest(options: any) {
    const request = await this.repo.findOne(options);
    if (!request) throw new NotFoundException('Request not found');
    else return request;
  }

  async generatePDF(user: User): Promise<Buffer> {
    const data: any = await this.findAll(user);
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        margin: 30,
        size: 'A4',
      });

      (async function () {
        // table
        const table = {
          title: 'Online Requests',
          subtitle: 'List of online requests Saved',
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
              label: 'Req No',
              width: 50,
              property: 'reqNo',
              renderer: null,
            },
            {
              label: 'Service',
              property: 'service',
              width: 100,
              renderer: null,
            },
            {
              label: 'Description',
              width: 150,
              property: 'description',
              renderer: null,
            },
            {
              label: 'Customer',
              width: 150,
              property: 'customer',
              renderer: (value: User, i, irow) => `${value.name}`,
            },
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
}
