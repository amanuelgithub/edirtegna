import { GroupMembershipEntity } from '@app/db/group';
import { FilterOperator, PaginateConfig, SelectOneConfig, copyConfig } from '@app/shared';

export class CreateGroupMembershipDto {}

export class UpdateGroupMembershipDto extends CreateGroupMembershipDto {}

export const GroupMembershipPageConfigDto: PaginateConfig<GroupMembershipEntity> = {
  sortableColumns: [],
  searchableColumns: ['id'],
  defaultSortBy: [['createdAt', 'DESC']],
  select: ['id', 'createdAt', 'updatedAt'],
  filterableColumns: {},
};

export const GroupMembershipSelectOneConfigDto = copyConfig(GroupMembershipPageConfigDto) as SelectOneConfig<GroupMembershipEntity>;
