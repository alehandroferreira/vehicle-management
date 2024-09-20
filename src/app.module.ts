import { Module } from '@nestjs/common';
import { CarsModule } from './modules/cars/cars.module';
import { DriversModule } from './modules/drivers/driver.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [CarsModule, DriversModule],
  providers: [PrismaService],
})
export class AppModule {}
