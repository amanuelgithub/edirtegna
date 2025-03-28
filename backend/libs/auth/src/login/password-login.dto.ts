import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PasswordLoginDto {
  @IsString()
  @Type(() => String)
  identifier: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => String)
  password?: string;
}
