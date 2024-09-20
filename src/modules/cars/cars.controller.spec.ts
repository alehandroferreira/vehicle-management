import { Test, TestingModule } from '@nestjs/testing';
import { Car } from '@prisma/client';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

describe('CarsController', () => {
  let controller: CarsController;
  let service: CarsService;

  const mockCar: Car = {
    id: 1,
    plate: 'ABC-1234',
    color: 'Red',
    brand: 'Toyota',
  };

  const mockCarsService = {
    create: jest.fn().mockResolvedValue(mockCar),
    update: jest.fn().mockResolvedValue(mockCar),
    delete: jest.fn().mockResolvedValue(mockCar),
    findUnique: jest.fn().mockResolvedValue(mockCar),
    findAll: jest.fn().mockResolvedValue([mockCar]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarsController],
      providers: [
        {
          provide: CarsService,
          useValue: mockCarsService,
        },
      ],
    }).compile();

    controller = module.get<CarsController>(CarsController);
    service = module.get<CarsService>(CarsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new car', async () => {
      const createCarDto: CreateCarDto = {
        plate: 'ABC-1234',
        color: 'Red',
        brand: 'Toyota',
      };

      const result = await controller.create(createCarDto);

      expect(result).toEqual(mockCar);
      expect(service.create).toHaveBeenCalledWith(createCarDto);
    });
  });

  describe('update', () => {
    it('should update a car by ID', async () => {
      const updateCarDto: UpdateCarDto = {
        plate: 'ABC-1234',
        color: 'Blue',
        brand: 'Toyota',
      };

      const result = await controller.update(1, updateCarDto);

      expect(result).toEqual(mockCar);
      expect(service.update).toHaveBeenCalledWith(1, updateCarDto);
    });
  });

  describe('delete', () => {
    it('should delete a car by ID', async () => {
      const result = await controller.delete(1);

      expect(result).toEqual(mockCar);
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('findUnique', () => {
    it('should find a car by ID', async () => {
      const result = await controller.findUnique(1);

      expect(result).toEqual(mockCar);
      expect(service.findUnique).toHaveBeenCalledWith(1);
    });
  });

  describe('findAll', () => {
    it('should find all cars', async () => {
      const result = await controller.findAll();

      expect(result).toEqual([mockCar]);
      expect(service.findAll).toHaveBeenCalledWith(undefined, undefined);
    });

    it('should filter cars by color and brand', async () => {
      const result = await controller.findAll('Red', 'Toyota');

      expect(result).toEqual([mockCar]);
      expect(service.findAll).toHaveBeenCalledWith('Red', 'Toyota');
    });
  });
});
