import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDetailDto } from '../dto/create-order-detail.dto';
import { CreateFullOrderDto } from '../dto/full-order.dto';
import { UpdateOrderDetailDto } from '../dto/update-order-detail.dto';
import { OrderDetail } from '../entities/order-detail.entity';
import { OrderService } from './order.service';

@Injectable()
export class OrderDetailService {
  constructor(private readonly orderService: OrderService) {}
  @InjectRepository(OrderDetail)
  private readonly repo: Repository<OrderDetail>;

  async create(createOrderDto: CreateOrderDetailDto): Promise<OrderDetail> {
    const order = await this.orderService.findOne(createOrderDto.order);

    if (order === null) throw new NotFoundException('Order not found');

    const newOrderDetail = new OrderDetail();

    newOrderDetail.productName = createOrderDto.productName;
    newOrderDetail.price = createOrderDto.price;
    newOrderDetail.discount = createOrderDto.discount;
    newOrderDetail.order = order;

    const orderDetail = this.repo.save(newOrderDetail);
    return orderDetail;
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDetailDto,
  ): Promise<OrderDetail> {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException('order detail not found');
    }

    if (updateOrderDto.productName)
      order.productName = updateOrderDto.productName;

    if (updateOrderDto.price) order.price = updateOrderDto.price;

    if (updateOrderDto.discount) order.discount = updateOrderDto.discount;

    await this.repo.save(order);

    return order;
  }

  async remove(id: string): Promise<Object> {
    const orderDetail = await this.findOne(id);

    await this.repo.delete(orderDetail.id);
    return {
      message: `order detrail with the id ${orderDetail.id} deleted successfully`,
    };
  }

  async createOrderAndOrderDetails(dto: CreateFullOrderDto): Promise<Object> {
    const order = {
      status: dto.status,
      customer: dto.customer,
    };

    let savedorder = await this.orderService.create(order);

    if (savedorder) {
      dto.details.forEach((detail) => {
        const orderDetail = {
          productName: detail.productName,
          price: detail.price,
          discount: detail.discount,
          order: savedorder.id,
        };

        this.create(orderDetail);
      });
    }

    return { message: 'order saved successfully' };
  }

  async findByOrder(id: string): Promise<OrderDetail[]> {
    //    const quotation = await this.quotationService.findOne(id);

    return this.repo.find({
      relations: {
        order: true,
      },
      where: {
        order: {
          id,
        },
      },
    });
  }
}
