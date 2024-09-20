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
import { Driver } from '@prisma/client';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Controller('drivers')
@ApiTags('Drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @ApiOperation({ summary: 'Create a driver record' })
  create(@Body() createDriverDto: CreateDriverDto): Promise<Driver> {
    return this.driversService.create(createDriverDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a driver by ID record' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the driver to update',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDriverDto: UpdateDriverDto,
  ): Promise<Driver> {
    return this.driversService.update(id, updateDriverDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a driver by ID record' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the driver to delete',
  })
  delete(@Param('id', ParseIntPipe) id: number): Promise<Driver> {
    return this.driversService.delete(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve driver by ID record' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the driver to retrieve',
  })
  findUnique(@Param('id', ParseIntPipe) id: number): Promise<Driver | null> {
    return this.driversService.findUnique(id);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all driver records' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by driver name',
  })
  findAll(@Query('name') name?: string): Promise<Driver[]> {
    return this.driversService.findAll(name);
  }
}
