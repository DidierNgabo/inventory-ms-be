import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderService {
  @InjectRepository(Order)
  private readonly orderRepo: Repository<Order>;

  create(createOrderDto: CreateOrderDto): Promise<Order> {
    const newOrder = { ...createOrderDto };

    const entity = Object.assign(new Order(), newOrder);

    const order = this.orderRepo.save(entity);
    return order;
  }

  findAll(): Promise<Order[]> {
    return this.orderRepo.find();
  }

  findOne(id: string): Promise<Order> {
    return this.orderRepo.findOne({ where: { id } });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    if (order === null) {
      throw new NotFoundException('order not found');
    }

    if (updateOrderDto.customer) order.customer = updateOrderDto.customer;

    if (updateOrderDto.status) order.status = updateOrderDto.status;

    await this.orderRepo.save(order);

    return order;
  }

  async remove(id: string): Promise<Object> {
    const order = await this.findOne(id);

    await this.orderRepo.delete(order.id);
    return {
      message: `order with the id ${order.id} deleted successfully`,
    };
  }
}
