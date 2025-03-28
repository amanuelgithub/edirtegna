import { Type } from 'class-transformer';
import { IsOptional, IsNotEmpty, IsNumber, IsString, IsIn, MaxLength } from 'class-validator';
import { BasePageOptionsDto, UserAccessStatus } from '@app/shared';

export class CleantAccessPageOptionsDto extends BasePageOptionsDto {
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  userId?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  id?: number;
}

export class CreateClientAccessDto {
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  userId?: number;

  @IsString()
  allowedUrls: string;

  @IsString()
  clientName: string;
}
export class UpdateClientAccessDto {
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  userId?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  allowedUrls?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(64)
  clientName?: string;

  @IsString()
  @IsIn(['ACTIVE', 'INACTIVE'])
  @IsNotEmpty()
  @IsOptional()
  status?: UserAccessStatus;
}
