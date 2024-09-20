import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class EndUsageDto {
  @ApiProperty({
    description: 'ID of the usage record to end',
    example: 1,
  })
  @IsInt()
  id: number;
}
