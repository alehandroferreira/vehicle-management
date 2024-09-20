import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';

@Module({
  imports: [PrismaModule],
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}
