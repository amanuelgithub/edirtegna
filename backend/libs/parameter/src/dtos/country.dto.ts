import { CountryEntity } from '@app/db/parameters';
import { FilterOperator, PaginateConfig, SelectOneConfig, copyConfig } from '@app/shared';
import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCountryDto {
  @IsString()
  countryName: string;

  @IsString()
  shortName?: string;

  @IsString()
  phonePrefix?: string;

  @IsBoolean()
  @Transform(({ value }) => {
    return [true, 'true', 'True', 'TRUE', '1', 1].includes(value);
  })
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  icon?: string;
}

export class UpdateCountryDto extends PartialType(CreateCountryDto) {}

export const CountryPageConfigDto: PaginateConfig<CountryEntity> = {
  sortableColumns: ['countryName'],
  searchableColumns: ['id', 'countryName'],
  defaultSortBy: [['createdAt', 'DESC']],
  select: ['id', 'countryName', 'icon', 'shortName', 'phonePrefix', 'isActive', 'createdAt', 'updatedAt'],
  filterableColumns: {
    countryName: [FilterOperator.ILIKE],
  },
};

export const CountrySelectOneConfigDto = copyConfig(CountryPageConfigDto) as SelectOneConfig<CountryEntity>;
