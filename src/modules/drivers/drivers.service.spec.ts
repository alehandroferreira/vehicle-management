import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Driver } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

describe('DriversService', () => {
  let service: DriversService;
  let prisma: PrismaService;

  const mockDriver: Driver = {
    id: 1,
    name: 'Alan Franco Garcia',
  };

  const createDriverDto: CreateDriverDto = {
    name: 'Alan Franco Garcia',
  };

  const updateDriverDto: UpdateDriverDto = {
    name: 'Alan Franco Garcia',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DriversService, PrismaService],
    }).compile();

    service = module.get<DriversService>(DriversService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a driver successfully', async () => {
      jest.spyOn(prisma.driver, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.driver, 'create').mockResolvedValue(mockDriver);

      const result = await service.create(createDriverDto);
      expect(result).toEqual(mockDriver);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest.spyOn(prisma.driver, 'findUnique').mockResolvedValue(null);
      jest
        .spyOn(prisma.driver, 'create')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(service.create(createDriverDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update a driver successfully', async () => {
      const updateDriverDto: UpdateDriverDto = { name: 'New Name' };
      jest.spyOn(prisma.driver, 'findUnique').mockResolvedValue(mockDriver);
      jest
        .spyOn(prisma.driver, 'update')
        .mockResolvedValue({ ...mockDriver, ...updateDriverDto });

      const result = await service.update(1, updateDriverDto);
      expect(result).toEqual({ ...mockDriver, ...updateDriverDto });
    });

    it('should throw NotFoundException if driver not found', async () => {
      jest.spyOn(prisma.driver, 'findUnique').mockResolvedValue(null);

      await expect(service.update(1, updateDriverDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest.spyOn(prisma.driver, 'findUnique').mockResolvedValue(mockDriver);
      jest
        .spyOn(prisma.driver, 'update')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(service.update(1, updateDriverDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a driver successfully', async () => {
      const mockDriver = { id: 1, name: 'John Doe' };

      jest.spyOn(prisma.driver, 'findUnique').mockResolvedValue(mockDriver);
      jest.spyOn(prisma.driver, 'delete').mockResolvedValue(mockDriver);

      const result = await service.delete(1);

      expect(result).toEqual(mockDriver);
      expect(prisma.driver.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prisma.driver.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if driver not found', async () => {
      jest.spyOn(prisma.driver, 'findUnique').mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      const error = new Error('Unexpected error');
      jest.spyOn(prisma.driver, 'findUnique').mockRejectedValue(error);

      await expect(service.delete(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findUnique', () => {
    it('should find a driver by ID successfully', async () => {
      jest.spyOn(prisma.driver, 'findUnique').mockResolvedValue(mockDriver);

      const result = await service.findUnique(1);
      expect(result).toEqual(mockDriver);
    });

    it('should throw NotFoundException if driver not found', async () => {
      jest.spyOn(prisma.driver, 'findUnique').mockResolvedValue(null);

      await expect(service.findUnique(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all drivers', async () => {
      const mockDrivers: Driver[] = [mockDriver];

      jest.spyOn(prisma.driver, 'findMany').mockResolvedValue(mockDrivers);

      const result = await service.findAll();
      expect(result).toEqual(mockDrivers);
    });

    it('should filter drivers by name', async () => {
      jest.spyOn(prisma.driver, 'findMany').mockResolvedValue([mockDriver]);

      const result = await service.findAll('Alan');
      expect(result).toEqual([mockDriver]);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(prisma.driver, 'findMany')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
