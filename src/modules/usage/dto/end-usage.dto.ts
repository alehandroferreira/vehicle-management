import { IsInt } from 'class-validator';

export class EndUsageDto {
  @IsInt()
  id: number;
}
