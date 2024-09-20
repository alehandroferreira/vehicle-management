import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCarDto {
  @ApiProperty({
    description: 'The plate number of the car',
    example: 'ABC-1234',
  })
  @IsString()
  @IsNotEmpty()
  plate: string;

  @ApiProperty({
    description: 'The color of the car',
    example: 'Red',
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    description: 'The brand of the car',
    example: 'Toyota',
  })
  @IsString()
  @IsNotEmpty()
  brand: string;
}
