import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from '../constants';
import { ORDER } from '../enums';
import { EnumValues, KeysOf } from '../enums/enum-type';

type Order = EnumValues<typeof ORDER>;
export class BasePageOptionsDto {
  @IsIn(KeysOf(ORDER))
  @IsOptional()
  order: Order = 'ASC';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page = 1;

  @Type(() => Number)
  @IsInt()
  @Min(MIN_PAGE_SIZE)
  @Max(MAX_PAGE_SIZE)
  @IsOptional()
  take: number = DEFAULT_PAGE_SIZE;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  sort?: string;
}
