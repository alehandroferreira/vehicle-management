import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDriverDto {
  @ApiProperty({
    description: 'The name of the driver',
    example: 'Alan Franco Garcia',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
