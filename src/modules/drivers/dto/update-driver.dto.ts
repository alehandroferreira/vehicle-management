import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDriverDto {
  @ApiProperty({
    description: 'The name of the driver',
    example: 'Alan Franco Garcia',
  })
  @IsString()
  @IsOptional()
  name?: string;
}
