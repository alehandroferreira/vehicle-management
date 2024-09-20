import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Driver } from '@prisma/client';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  create(@Body() createDriverDto: CreateDriverDto): Promise<Driver> {
    return this.driversService.create(createDriverDto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateDriverDto: UpdateDriverDto,
  ): Promise<Driver> {
    return this.driversService.update(id, updateDriverDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<Driver> {
    return this.driversService.delete(id);
  }

  @Get(':id')
  findUnique(@Param('id') id: number): Promise<Driver | null> {
    return this.driversService.findUnique(id);
  }

  @Get()
  findAll(@Query('name') name?: string): Promise<Driver[]> {
    return this.driversService.findAll(name);
  }
}
