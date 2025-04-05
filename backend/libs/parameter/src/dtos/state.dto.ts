import { StateEntity } from '@app/db/parameters';
import { IsString } from 'class-validator';
import { FilterOperator, PaginateConfig, SelectOneConfig, copyConfig } from '@app/shared';

export class CreateStateDto {
  @IsString()
  stateName: string;
}

export class UpdateStateDto extends CreateStateDto {}

export const StatePageConfigDto: PaginateConfig<StateEntity> = {
  sortableColumns: ['id', 'stateName'],
  defaultSortBy: [['createdAt', 'DESC']],
  searchableColumns: ['stateName'],
  select: ['id', 'stateName', 'createdAt', 'updatedAt'],
  filterableColumns: {
    stateName: [FilterOperator.ILIKE],
  },
};

export const StateSelectOneConfigDto = copyConfig(StatePageConfigDto) as SelectOneConfig<StateEntity>;
