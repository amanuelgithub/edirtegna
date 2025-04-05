import { EventEntity } from '@app/db/group';
import { FilterOperator, PaginateConfig, SelectOneConfig, copyConfig } from '@app/shared';

export class CreateEventDto {}

export class UpdateEventDto extends CreateEventDto {}

export const EventPageConfigDto: PaginateConfig<EventEntity> = {
  sortableColumns: [],
  searchableColumns: ['id'],
  defaultSortBy: [['createdAt', 'DESC']],
  select: ['id', 'createdAt', 'updatedAt'],
  filterableColumns: {},
};

export const EventSelectOneConfigDto = copyConfig(EventPageConfigDto) as SelectOneConfig<EventEntity>;
