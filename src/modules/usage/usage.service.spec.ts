import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Usage } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUsageDto } from './dto/create-usage.dto';
import { UsageService } from './usage.service';

describe('UsageService', () => {
  let service: UsageService;
  let prisma: PrismaService;

  const mockUsage: Usage = {
    id: 1,
    driverId: 1,
    carId: 1,
    reason: 'Business trip',
    startDate: new Date(),
    endDate: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsageService, PrismaService],
    }).compile();

    service = module.get<UsageService>(UsageService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUsageDto: CreateUsageDto = {
      driverId: 1,
      carId: 1,
      startDate: new Date(),
      reason: 'Business trip',
    };

    it('should create a new usage record', async () => {
      jest.spyOn(prisma.usage, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prisma.usage, 'create').mockResolvedValue(mockUsage);

      const result = await service.create(createUsageDto);
      expect(result).toEqual(mockUsage);
      expect(prisma.usage.create).toHaveBeenCalledWith({
        data: createUsageDto,
      });
    });

    it('should throw ConflictException if car is already in use', async () => {
      jest.spyOn(prisma.usage, 'findFirst').mockResolvedValueOnce(mockUsage);

      await expect(service.create(createUsageDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException if driver is already using another car', async () => {
      jest.spyOn(prisma.usage, 'findFirst').mockResolvedValueOnce(null);
      jest.spyOn(prisma.usage, 'findFirst').mockResolvedValueOnce(mockUsage);

      await expect(service.create(createUsageDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest.spyOn(prisma.usage, 'findFirst').mockResolvedValue(null);
      jest
        .spyOn(prisma.usage, 'create')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(service.create(createUsageDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('endUsage', () => {
    it('should end a usage record', async () => {
      jest.spyOn(prisma.usage, 'findUnique').mockResolvedValue(mockUsage);
      jest
        .spyOn(prisma.usage, 'update')
        .mockResolvedValue({ ...mockUsage, endDate: new Date() });

      const result = await service.endUsage(1);
      expect(result).toEqual({ ...mockUsage, endDate: expect.any(Date) });
      expect(prisma.usage.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { endDate: expect.any(Date) },
      });
    });

    it('should throw NotFoundException if usage record not found', async () => {
      jest.spyOn(prisma.usage, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.endUsage(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if usage record already ended', async () => {
      jest.spyOn(prisma.usage, 'findUnique').mockResolvedValueOnce({
        ...mockUsage,
        endDate: new Date(),
      });

      await expect(service.endUsage(1)).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(prisma.usage, 'findUnique')
        .mockRejectedValueOnce(new Error('Unexpected error'));

      await expect(service.endUsage(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all usage records', async () => {
      jest.spyOn(prisma.usage, 'findMany').mockResolvedValue([mockUsage]);

      const result = await service.findAll();
      expect(result).toEqual([mockUsage]);
      expect(prisma.usage.findMany).toHaveBeenCalledWith({
        include: {
          Driver: true,
          Car: true,
        },
      });
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(prisma.usage, 'findMany')
        .mockRejectedValueOnce(new Error('Unexpected error'));

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
