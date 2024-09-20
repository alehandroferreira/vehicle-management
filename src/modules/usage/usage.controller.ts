import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Usage } from '@prisma/client';
import { CreateUsageDto } from './dto/create-usage.dto';
import { UsageService } from './usage.service';

@Controller('usage')
@ApiTags('Usage')
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a usage record' })
  create(
    @Body()
    createUsageDto: CreateUsageDto,
  ): Promise<Usage> {
    return this.usageService.create(createUsageDto);
  }

  @Put(':id/end')
  @ApiOperation({ summary: 'End a usage record' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the usage to retrieve',
  })
  endUsage(@Param('id', ParseIntPipe) id: number): Promise<Usage> {
    return this.usageService.endUsage(id);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all usage records' })
  findAll(): Promise<Usage[]> {
    return this.usageService.findAll();
  }
}
