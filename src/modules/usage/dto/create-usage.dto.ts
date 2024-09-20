import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateUsageDto {
  @ApiProperty({
    description: 'ID of the driver',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  driverId: number;

  @ApiProperty({
    description: 'ID of the car',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  carId: number;

  @ApiProperty({
    description: 'Start date of the usage in ISO format',
    example: '2024-09-20T14:30:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    description: 'Reason for using the car',
    example: 'Business trip',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
