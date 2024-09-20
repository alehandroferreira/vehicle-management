import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Usage } from '@prisma/client';
import { UsageService } from './usage.service';

@Controller('usage')
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  @Post()
  create(
    @Body()
    body: {
      driverId: number;
      carId: number;
      startDate: Date;
      reason: string;
    },
  ): Promise<Usage> {
    return this.usageService.create(body);
  }

  @Put(':id/end')
  endUsage(@Param('id') id: number): Promise<Usage> {
    return this.usageService.endUsage(id);
  }

  @Get()
  findAll(): Promise<Usage[]> {
    return this.usageService.findAll();
  }
}
