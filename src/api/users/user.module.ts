import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import { Role } from './entities/role.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  controllers: [UserController, RoleController],
  providers: [UserService, RoleService],
  imports: [AuthModule, TypeOrmModule.forFeature([User, Role])],
})
export class UserModule {}
