import { Public } from '@/common/helper/PublicDecorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderDetailDto } from '../dto/create-order-detail.dto';
import { CreateFullOrderDto } from '../dto/full-order.dto';
import { UpdateOrderDetailDto } from '../dto/update-order-detail.dto';
import { OrderDetailService } from '../services/order-detail.service';

@ApiTags('order-details')
@Controller('order-details')
@Public()
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Get()
  findAll() {
    return this.orderDetailService.findAll();
  }

  @Post('full')
  createFull(@Body() dto: CreateFullOrderDto) {
    return this.orderDetailService.createOrderAndOrderDetails(dto);
  }

  @Post()
  create(@Body() dto: CreateOrderDetailDto) {
    return this.orderDetailService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderDetailService.findOne(id);
  }

  @Get('/order/:id')
  findByQuotation(@Param('id') id: string) {
    return this.orderDetailService.findByOrder(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDetailDto,
  ) {
    return this.orderDetailService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderDetailService.remove(id);
  }
}
