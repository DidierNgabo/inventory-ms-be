import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { Inspection } from './entities/inspection.entity';

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
    return this.repo.find();
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
}
