import { GroupEntity } from '@app/db/group';
import { FilterOperator, PaginateConfig, SelectOneConfig, copyConfig } from '@app/shared';

export class CreateGroupDto {}

export class UpdateGroupDto extends CreateGroupDto {}

export const GroupPageConfigDto: PaginateConfig<GroupEntity> = {
  sortableColumns: [],
  searchableColumns: ['id'],
  defaultSortBy: [['createdAt', 'DESC']],
  select: ['id', 'createdAt', 'updatedAt'],
  filterableColumns: {},
};

export const GroupSelectOneConfigDto = copyConfig(GroupPageConfigDto) as SelectOneConfig<GroupEntity>;
