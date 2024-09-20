import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Usage } from '@prisma/client';
import { CreateUsageDto } from './dto/create-usage.dto';
import { UsageController } from './usage.controller';
import { UsageService } from './usage.service';

describe('UsageController', () => {
  let controller: UsageController;
  let service: UsageService;

  const mockUsage: Usage = {
    id: 1,
    driverId: 1,
    carId: 1,
    startDate: new Date('2024-09-20T14:30:00Z'),
    reason: 'Business trip',
    endDate: null,
  };

  const mockUsageService = {
    create: jest.fn().mockResolvedValue(mockUsage),
    endUsage: jest.fn().mockResolvedValue(mockUsage),
    findAll: jest.fn().mockResolvedValue([mockUsage]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsageController],
      providers: [
        {
          provide: UsageService,
          useValue: mockUsageService,
        },
      ],
    }).compile();

    controller = module.get<UsageController>(UsageController);
    service = module.get<UsageService>(UsageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a usage record', async () => {
      const createUsageDto: CreateUsageDto = {
        driverId: 1,
        carId: 1,
        startDate: new Date('2024-09-20T14:30:00Z'),
        reason: 'Business trip',
      };
      const result = await controller.create(createUsageDto);
      expect(result).toEqual(mockUsage);
      expect(service.create).toHaveBeenCalledWith(createUsageDto);
    });
  });

  describe('endUsage', () => {
    it('should end a usage record', async () => {
      const result = await controller.endUsage(1);
      expect(result).toEqual(mockUsage);
      expect(service.endUsage).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if usage record not found', async () => {
      (service.endUsage as jest.Mock).mockRejectedValue(
        new NotFoundException('Usage record not found'),
      );

      await expect(controller.endUsage(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of usage records', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockUsage]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
