import { CityEntity } from '@app/db/parameters';
import { FilterOperator, PaginateConfig, SelectOneConfig, copyConfig } from '@app/shared';

export class CreateCityDto {}

export class UpdateCityDto extends CreateCityDto {}

export const CityPageConfigDto: PaginateConfig<CityEntity> = {
  sortableColumns: ['cityName'],
  searchableColumns: ['id', 'cityName'],
  defaultSortBy: [['createdAt', 'DESC']],
  select: ['id', 'cityName', 'createdAt', 'updatedAt', 'country.id', 'country.countryName', 'state.id', 'state.stateName'],
  relations: ['country', 'state'],
  filterableColumns: {
    countryName: [FilterOperator.ILIKE],
  },
};

export const CitySelectOneConfigDto = copyConfig(CityPageConfigDto) as SelectOneConfig<CityEntity>;
