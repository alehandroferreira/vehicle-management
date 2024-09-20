import { IsOptional, IsString } from 'class-validator';

export class UpdateDriverDto {
  @IsString()
  @IsOptional()
  name?: string;
}
