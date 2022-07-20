import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateOnlineRequestDto } from './dto/create-online-request.dto';
import { UpdateOnlineRequestDto } from './dto/update-online-request.dto';
import { OnlineRequest } from './entities/online-request.entity';

@Injectable()
export class OnlineRequestsService {
  constructor(
    @InjectRepository(OnlineRequest)
    private readonly repo: Repository<OnlineRequest>,
  ) {}

  create(dto: CreateOnlineRequestDto, customer: User): Promise<OnlineRequest> {
    const request = new OnlineRequest();

    request.customer = customer;
    request.description = dto.description;
    request.service = dto.service;
    request.status = dto.status;
    return this.repo.save(request);
  }

  findAll(): Promise<OnlineRequest[]> {
    return this.repo.find({
      relations: {
        customer: true,
      },
    });
  }

  findOne(id: string): Promise<OnlineRequest> {
    return this.repo.findOne({ where: { id } });
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

  async findRequest(options: any) {
    const request = await this.repo.findOne(options);
    if (!request) throw new NotFoundException('Request not found');
    else return request;
  }
}
