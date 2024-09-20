import { Module } from '@nestjs/common';
import { CarsModule } from './modules/cars/cars.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [CarsModule],
  providers: [PrismaService],
})
export class AppModule {}
