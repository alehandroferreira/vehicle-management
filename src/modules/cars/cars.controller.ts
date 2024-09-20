import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Car } from '@prisma/client';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Controller('cars')
@ApiTags('Cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a car record' })
  create(@Body() createCarDto: CreateCarDto): Promise<Car> {
    return this.carsService.create(createCarDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a car by ID record' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the car to update',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCarDto: UpdateCarDto,
  ): Promise<Car> {
    return this.carsService.update(id, updateCarDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a car by ID record' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the car to delete',
  })
  delete(@Param('id', ParseIntPipe) id: number): Promise<Car> {
    return this.carsService.delete(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve car by ID record' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the car to retrieve',
  })
  findUnique(@Param('id', ParseIntPipe) id: number): Promise<Car | null> {
    return this.carsService.findUnique(id);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all car records' })
  @ApiQuery({
    name: 'color',
    required: false,
    description: 'Filter by car color',
  })
  @ApiQuery({
    name: 'brand',
    required: false,
    description: 'Filter by car brand',
  })
  findAll(
    @Query('color') color?: string,
    @Query('brand') brand?: string,
  ): Promise<Car[]> {
    return this.carsService.findAll(color, brand);
  }
}
