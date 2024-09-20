import { Injectable } from '@nestjs/common';
import { Usage } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    driverId: number;
    carId: number;
    startDate: Date;
    reason: string;
  }): Promise<Usage> {
    return this.prisma.usage.create({ data });
  }

  async endUsage(id: number): Promise<Usage> {
    return this.prisma.usage.update({
      where: { id },
      data: { endDate: new Date() },
    });
  }

  async findAll(): Promise<Usage[]> {
    return this.prisma.usage.findMany({
      include: {
        driver: true,
        car: true,
      },
    });
  }
}
