import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { OrderDetailService } from './services/order-detail.service';
import { OrderDetailController } from './controllers/order-detail.controller';

@Module({
  controllers: [OrderController, OrderDetailController],
  providers: [OrderService, OrderDetailService],
  imports: [TypeOrmModule.forFeature([Order, OrderDetail])],
})
export class OrderModule {}
