import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Car } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';

describe('CarsService', () => {
  let service: CarsService;
  let prisma: PrismaService;

  const mockCar: Car = {
    id: 1,
    plate: 'ABC-1234',
    color: 'Red',
    brand: 'Toyota',
  };

  const createCarDto: CreateCarDto = {
    plate: 'ABC-1234',
    color: 'Red',
    brand: 'Toyota',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarsService, PrismaService],
    }).compile();

    service = module.get<CarsService>(CarsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a car successfully', async () => {
      jest.spyOn(prisma.car, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.car, 'create').mockResolvedValue(mockCar);

      const result = await service.create(createCarDto);
      expect(result).toEqual(mockCar);
    });

    it('should throw ConflictException if car plate already exists', async () => {
      jest.spyOn(prisma.car, 'findUnique').mockResolvedValue(mockCar);

      await expect(service.create(createCarDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest.spyOn(prisma.car, 'findUnique').mockResolvedValue(null);
      jest
        .spyOn(prisma.car, 'create')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(service.create(createCarDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update a car successfully', async () => {
      const updateCarDto = { plate: 'ABC-1234' };
      jest.spyOn(prisma.car, 'findUnique').mockResolvedValue(mockCar);
      jest.spyOn(prisma.car, 'findFirst').mockResolvedValue(null);
      jest
        .spyOn(prisma.car, 'update')
        .mockResolvedValue({ ...mockCar, ...updateCarDto });

      const result = await service.update(1, updateCarDto);
      expect(result).toEqual({ ...mockCar, ...updateCarDto });
    });

    it('should throw ConflictException if car plate already exists', async () => {
      const updateCarDto = { plate: 'XYZ-5678' };

      const existingCar = {
        id: 1,
        plate: 'ABC-1234',
        color: 'red',
        brand: 'Toyota',
      };
      const duplicateCar = {
        id: 2,
        plate: 'XYZ-5678',
        color: 'blue',
        brand: 'Honda',
      };

      jest.spyOn(prisma.car, 'findUnique').mockResolvedValueOnce(existingCar);
      jest.spyOn(prisma.car, 'findUnique').mockResolvedValueOnce(duplicateCar);

      await expect(service.update(1, updateCarDto)).rejects.toThrow(
        ConflictException,
      );

      expect(prisma.car.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.car.findUnique).toHaveBeenCalledWith({
        where: { plate: updateCarDto.plate },
      });
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      const updateCarDto = { plate: 'ABC-1234' };
      jest.spyOn(prisma.car, 'findUnique').mockResolvedValue(mockCar);
      jest.spyOn(prisma.car, 'findFirst').mockResolvedValue(null);
      jest
        .spyOn(prisma.car, 'update')
        .mockRejectedValueOnce(new Error('Unexpected error'));

      await expect(service.update(1, updateCarDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a car successfully', async () => {
      jest.spyOn(prisma.car, 'delete').mockResolvedValue(mockCar);

      const result = await service.delete(1);
      expect(result).toEqual(mockCar);
    });

    it('should throw NotFoundException if car not found', async () => {
      jest.spyOn(prisma.car, 'delete').mockRejectedValue({ code: 'P2025' });

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(prisma.car, 'delete')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(service.delete(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findUnique', () => {
    it('should find a car by ID successfully', async () => {
      jest.spyOn(prisma.car, 'findUnique').mockResolvedValue(mockCar);

      const result = await service.findUnique(1);
      expect(result).toEqual(mockCar);
    });

    it('should throw NotFoundException if car not found', async () => {
      jest.spyOn(prisma.car, 'findUnique').mockResolvedValue(null);

      await expect(service.findUnique(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all cars', async () => {
      const mockCars: Car[] = [mockCar];

      jest.spyOn(prisma.car, 'findMany').mockResolvedValue(mockCars);

      const result = await service.findAll();
      expect(result).toEqual(mockCars);
    });

    it('should filter cars by color and brand', async () => {
      jest.spyOn(prisma.car, 'findMany').mockResolvedValue([mockCar]);

      const result = await service.findAll('Red', 'Toyota');
      expect(result).toEqual([mockCar]);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(prisma.car, 'findMany')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
