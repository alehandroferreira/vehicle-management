import { Injectable, NotFoundException } from '@nestjs/common';
import { Driver } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDriverDto): Promise<Driver> {
    return this.prisma.driver.create({ data });
  }

  async update(id: number, data: UpdateDriverDto): Promise<Driver> {
    const driver = await this.prisma.driver.findUnique({ where: { id } });
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }
    return this.prisma.driver.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Driver> {
    const driver = await this.prisma.driver.findUnique({ where: { id } });
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }
    return this.prisma.driver.delete({
      where: { id },
    });
  }

  async findUnique(id: number): Promise<Driver | null> {
    return this.prisma.driver.findUnique({
      where: { id },
    });
  }

  async findAll(name?: string): Promise<Driver[]> {
    return this.prisma.driver.findMany({
      where: {
        ...(name ? { name: { contains: name, mode: 'insensitive' } } : {}),
      },
    });
  }
}
