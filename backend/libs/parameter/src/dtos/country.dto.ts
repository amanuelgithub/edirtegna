import { CountryEntity } from '@app/db/parameters';
import { FilterOperator, PaginateConfig, SelectOneConfig, copyConfig } from '@app/shared';
import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  countryName: string;

  @IsString()
  shortName?: string;

  @IsString()
  phonePrefix?: string;

  @IsString()
  @IsOptional()
  icon?: string;
}

export class UpdateCountryDto extends PartialType(CreateCountryDto) {}

export const CountryPageConfigDto: PaginateConfig<CountryEntity> = {
  sortableColumns: ['countryName'],
  searchableColumns: ['id', 'countryName'],
  defaultSortBy: [['createdAt', 'DESC']],
  select: ['id', 'countryName', 'icon', 'createdAt', 'updatedAt'],
  filterableColumns: {
    countryName: [FilterOperator.ILIKE],
  },
};

export const CountrySelectOneConfigDto = copyConfig(CountryPageConfigDto) as SelectOneConfig<CountryEntity>;
