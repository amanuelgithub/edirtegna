import { StateEntity } from '@app/db/parameters';
import { IsNumber, IsString } from 'class-validator';
import { FilterOperator, PaginateConfig, SelectOneConfig, copyConfig } from '@app/shared';
import { Type } from 'class-transformer';

export class CreateStateDto {
  @IsString()
  stateName: string;

  @IsNumber()
  @Type(() => Number)
  countryId: number;
}

export class UpdateStateDto extends CreateStateDto {}

export const StatePageConfigDto: PaginateConfig<StateEntity> = {
  sortableColumns: ['id', 'stateName'],
  defaultSortBy: [['createdAt', 'DESC']],
  searchableColumns: ['stateName'],
  select: ['id', 'stateName', 'createdAt', 'updatedAt', 'country.id', 'country.countryName'],
  relations: ['country'],
  filterableColumns: {
    stateName: [FilterOperator.ILIKE],
  },
};

export const StateSelectOneConfigDto = copyConfig(StatePageConfigDto) as SelectOneConfig<StateEntity>;
