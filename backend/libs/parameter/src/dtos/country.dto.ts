import { CountryEntity } from '@app/db/parameters';
import { FilterOperator, PaginateConfig, SelectOneConfig, copyConfig } from '@app/shared';

export class CreateCountryDto {}

export class UpdateCountryDto extends CreateCountryDto {}

export const CountryPageConfigDto: PaginateConfig<CountryEntity> = {
  sortableColumns: ['countryName'],
  searchableColumns: ['id', 'countryName'],
  defaultSortBy: [['createdAt', 'DESC']],
  select: ['id', 'countryName', 'createdAt', 'updatedAt'],
  filterableColumns: {
    countryName: [FilterOperator.ILIKE],
  },
};

export const CountrySelectOneConfigDto = copyConfig(CountryPageConfigDto) as SelectOneConfig<CountryEntity>;
