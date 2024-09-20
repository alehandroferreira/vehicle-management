import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCarDto {
  @ApiProperty({
    description: 'The plate number of the car',
    example: 'ABC-1234',
    required: false,
  })
  @IsString()
  @IsOptional()
  plate?: string;

  @ApiProperty({
    description: 'The color of the car',
    example: 'Red',
    required: false,
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({
    description: 'The brand of the car',
    example: 'Toyota',
    required: false,
  })
  @IsString()
  @IsOptional()
  brand?: string;
}
