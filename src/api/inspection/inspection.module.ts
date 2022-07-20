import { Module } from '@nestjs/common';
import { InspectionService } from './inspection.service';
import { InspectionController } from './inspection.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inspection } from './entities/inspection.entity';

@Module({
  controllers: [InspectionController],
  imports: [TypeOrmModule.forFeature([Inspection])],
  providers: [InspectionService],
})
export class InspectionModule {}
