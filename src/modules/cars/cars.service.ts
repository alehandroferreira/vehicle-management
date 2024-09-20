import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  constructor(private prisma: PrismaService) {}

  async create(createCarDto: CreateCarDto) {
    return this.prisma.car.create({ data: createCarDto });
  }

  async findAll() {
    return this.prisma.car.findMany();
  }

  async findOne(id: number) {
    return this.prisma.car.findUnique({ where: { id } });
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    return this.prisma.car.update({ where: { id }, data: updateCarDto });
  }

  async remove(id: number) {
    return this.prisma.car.delete({ where: { id } });
  }
}
