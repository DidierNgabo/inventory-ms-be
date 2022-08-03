import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [AuthModule, TypeOrmModule.forFeature([User]), RolesModule],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
