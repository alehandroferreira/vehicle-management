import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Car } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  private readonly logger = new Logger(CarsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCarDto): Promise<Car> {
    try {
      const existingCar = await this.prisma.car.findUnique({
        where: { plate: data.plate },
      });

      if (existingCar) {
        // Lança uma exceção de conflito se a placa já existir
        this.logger.warn(`Car with plate ${data.plate} already exists.`);
        throw new ConflictException(
          `Car with plate ${data.plate} already exists.`,
        );
      }

      return await this.prisma.car.create({ data });
    } catch (err) {
      if (err instanceof ConflictException) {
        // Se for uma exceção de conflito, apenas relança
        throw err;
      }
      this.logger.error('Failed to create car.', err.stack);
      throw new InternalServerErrorException('Failed to create car.');
    }
  }

  async update(id: number, data: UpdateCarDto): Promise<Car> {
    try {
      const existingCar = await this.prisma.car.findUnique({
        where: { id },
      });

      if (!existingCar) {
        throw new NotFoundException(`Car with ID ${id} not found.`);
      }

      // Se uma placa estiver sendo alterada, verifica se já existe outra com a mesma placa
      if (data.plate && data.plate !== existingCar.plate) {
        const duplicateCar = await this.prisma.car.findUnique({
          where: { plate: data.plate },
        });

        if (duplicateCar) {
          throw new ConflictException(
            `Car with plate ${data.plate} already exists.`,
          );
        }
      }
      return await this.prisma.car.update({
        where: { id },
        data,
      });
    } catch (err) {
      if (
        err instanceof NotFoundException ||
        err instanceof ConflictException
      ) {
        throw err;
      }
      this.logger.error('Failed to update car.', err.stack);
      throw new InternalServerErrorException('Failed to update car.');
    }
  }

  async delete(id: number): Promise<Car> {
    try {
      const car = await this.prisma.car.delete({
        where: { id },
      });
      return car;
    } catch (err) {
      if (err.code === 'P2025') {
        // Código de erro do Prisma para "Registro não encontrado"
        this.logger.warn(`Car with ID ${id} not found.`);
        throw new NotFoundException(`Car with ID ${id} not found.`);
      }
      this.logger.error('Failed to delete car.', err.stack);
      throw new InternalServerErrorException('Failed to delete car.');
    }
  }

  async findUnique(id: number): Promise<Car | null> {
    try {
      const car = await this.prisma.car.findUnique({
        where: { id },
      });

      if (!car) {
        throw new NotFoundException(`Car with ID ${id} not found.`);
      }

      return car;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }

      this.logger.error('Failed to retrieve car.', err.stack);
      throw new InternalServerErrorException('Failed to retrieve car.');
    }
  }

  async findAll(color?: string, brand?: string): Promise<Car[]> {
    try {
      return await this.prisma.car.findMany({
        where: {
          ...(color ? { color: { contains: color } } : {}),
          ...(brand ? { brand: { contains: brand } } : {}),
        },
      });
    } catch (err) {
      this.logger.error('Failed to retrieve cars.', err.stack);
      throw new InternalServerErrorException('Failed to retrieve cars.');
    }
  }
}
