import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateUsageDto {
  @IsInt()
  @IsNotEmpty()
  driverId: number;

  @IsInt()
  @IsNotEmpty()
  carId: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
