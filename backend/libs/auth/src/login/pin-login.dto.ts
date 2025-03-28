import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class PinLoginDto {
  @IsString()
  @Type(() => String)
  phone: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  deviceUuid?: string; // should this be optional?

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(9999)
  pinCode: number;
}
