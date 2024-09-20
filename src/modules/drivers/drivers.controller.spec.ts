import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Driver } from '@prisma/client';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

describe('DriversController', () => {
  let controller: DriversController;
  let service: DriversService;

  const mockDriver: Driver = {
    id: 1,
    name: 'Alan Franco Garcia',
  };

  const mockDriversService = {
    create: jest.fn().mockResolvedValue(mockDriver),
    update: jest.fn().mockResolvedValue(mockDriver),
    delete: jest.fn().mockResolvedValue(mockDriver),
    findUnique: jest.fn().mockResolvedValue(mockDriver),
    findAll: jest.fn().mockResolvedValue([mockDriver]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriversController],
      providers: [
        {
          provide: DriversService,
          useValue: mockDriversService,
        },
      ],
    }).compile();

    controller = module.get<DriversController>(DriversController);
    service = module.get<DriversService>(DriversService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new driver', async () => {
      const createDriverDto: CreateDriverDto = {
        name: 'Alan Franco Garcia',
      };
      const result = await controller.create(createDriverDto);
      expect(result).toEqual(mockDriver);
      expect(service.create).toHaveBeenCalledWith(createDriverDto);
    });
  });

  describe('update', () => {
    it('should update a driver by ID', async () => {
      const updateDriverDto: UpdateDriverDto = {
        name: 'Alan Franco Garcia',
      };
      const result = await controller.update(1, updateDriverDto);
      expect(result).toEqual(mockDriver);
      expect(service.update).toHaveBeenCalledWith(1, updateDriverDto);
    });

    it('should throw NotFoundException if driver not found', async () => {
      (service.update as jest.Mock).mockRejectedValue(
        new NotFoundException('Driver not found'),
      );
      const updateDriverDto: UpdateDriverDto = { name: 'Alan Franco Garcia' };

      await expect(controller.update(1, updateDriverDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a driver by ID', async () => {
      const result = await controller.delete(1);
      expect(result).toEqual(mockDriver);
      expect(service.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if driver not found', async () => {
      (service.delete as jest.Mock).mockRejectedValue(
        new NotFoundException('Driver not found'),
      );

      await expect(controller.delete(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findUnique', () => {
    it('should find a driver by ID', async () => {
      const result = await controller.findUnique(1);
      expect(result).toEqual(mockDriver);
      expect(service.findUnique).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if driver not found', async () => {
      (service.findUnique as jest.Mock).mockRejectedValue(
        new NotFoundException('Driver not found'),
      );

      await expect(controller.findUnique(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all drivers', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockDriver]);
      expect(service.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should filter drivers by name', async () => {
      const result = await controller.findAll('Alan');
      expect(result).toEqual([mockDriver]);
      expect(service.findAll).toHaveBeenCalledWith('Alan');
    });
  });
});
