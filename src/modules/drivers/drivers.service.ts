import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Driver } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriversService {
  private readonly logger = new Logger(DriversService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDriverDto): Promise<Driver> {
    try {
      return await this.prisma.driver.create({ data });
    } catch (err) {
      this.logger.error('Failed to create driver', err.stack);
      throw new InternalServerErrorException('Failed to create driver');
    }
  }

  async update(id: number, data: UpdateDriverDto): Promise<Driver> {
    try {
      const driver = await this.prisma.driver.findUnique({ where: { id } });
      if (!driver) {
        throw new NotFoundException(`Driver with ID ${id} not found`);
      }
      return await this.prisma.driver.update({
        where: { id },
        data,
      });
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      this.logger.error(`Failed to update driver with ID ${id}`, err.stack);
      throw new InternalServerErrorException('Failed to update driver');
    }
  }

  async delete(id: number): Promise<Driver> {
    try {
      const driver = await this.prisma.driver.findUnique({ where: { id } });
      if (!driver) {
        throw new NotFoundException(`Driver with ID ${id} not found`);
      }
      return await this.prisma.driver.delete({
        where: { id },
      });
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      this.logger.error(`Failed to delete driver with ID ${id}`, err.stack);
      throw new InternalServerErrorException('Failed to delete driver');
    }
  }

  async findUnique(id: number): Promise<Driver | null> {
    try {
      const driver = await this.prisma.driver.findUnique({
        where: { id },
      });
      if (!driver) {
        throw new NotFoundException(`Driver with ID ${id} not found`);
      }
      return driver;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      this.logger.error(`Failed to retrieve driver with ID ${id}`, err.stack);
      throw new InternalServerErrorException('Failed to retrieve driver');
    }
  }

  async findAll(name?: string): Promise<Driver[]> {
    try {
      return await this.prisma.driver.findMany({
        where: {
          ...(name ? { name: { contains: name, mode: 'insensitive' } } : {}),
        },
      });
    } catch (err) {
      this.logger.error('Failed to retrieve drivers', err.stack);
      throw new InternalServerErrorException('Failed to retrieve drivers');
    }
  }
}
