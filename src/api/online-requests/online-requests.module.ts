import { Module } from '@nestjs/common';
import { OnlineRequestsService } from './online-requests.service';
import { OnlineRequestsController } from './online-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnlineRequest } from './entities/online-request.entity';
import { UserModule } from '../users/user.module';

@Module({
  controllers: [OnlineRequestsController],
  imports: [TypeOrmModule.forFeature([OnlineRequest]), UserModule],
  providers: [OnlineRequestsService],
})
export class OnlineRequestsModule {}
