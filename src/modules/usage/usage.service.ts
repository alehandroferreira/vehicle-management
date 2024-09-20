import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Usage } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUsageDto } from './dto/create-usage.dto';

@Injectable()
export class UsageService {
  private readonly logger = new Logger(UsageService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUsageDto): Promise<Usage> {
    try {
      // Verifica se o carro já está em uso
      const carInUse = await this.prisma.usage.findFirst({
        where: {
          carId: data.carId,
          endDate: null,
        },
      });

      if (carInUse) {
        this.logger.warn(`Car with ID ${data.carId} is already in use.`);
        throw new ConflictException(
          `Car with ID ${data.carId} is already in use.`,
        );
      }

      // Verifica se o motorista já está utilizando outro carro
      const driverInUse = await this.prisma.usage.findFirst({
        where: {
          driverId: data.driverId,
          endDate: null,
        },
      });

      if (driverInUse) {
        this.logger.warn(
          `Driver with ID ${data.driverId} is already using another car.`,
        );
        throw new ConflictException(
          `Driver with ID ${data.driverId} is already using another car.`,
        );
      }

      return await this.prisma.usage.create({ data });
    } catch (err) {
      if (!(err instanceof ConflictException)) {
        this.logger.error('Failed to create usage record.', err.stack);
        throw new InternalServerErrorException(
          'Failed to create usage record.',
        );
      }
      throw err;
    }
  }

  async endUsage(id: number): Promise<Usage> {
    try {
      const usage = await this.prisma.usage.findUnique({ where: { id } });

      if (!usage) {
        throw new NotFoundException(`Usage record with ID ${id} not found.`);
      }

      // Verifica se o uso já foi encerrado
      if (usage.endDate) {
        throw new ConflictException(
          `Usage record with ID ${id} has already ended.`,
        );
      }

      return await this.prisma.usage.update({
        where: { id },
        data: { endDate: new Date() },
      });
    } catch (err) {
      if (
        err instanceof NotFoundException ||
        err instanceof ConflictException
      ) {
        throw err;
      }
      this.logger.error('Failed to end usage record.', err.stack);
      throw new InternalServerErrorException('Failed to end usage record.');
    }
  }

  async findAll(): Promise<Usage[]> {
    try {
      return await this.prisma.usage.findMany({
        include: {
          Driver: true,
          Car: true,
        },
      });
    } catch (err) {
      this.logger.error('Failed to retrieve usage records.', err.stack);
      throw new InternalServerErrorException(
        'Failed to retrieve usage records.',
      );
    }
  }
}
