import { MembershipRequestEntity } from '@app/db/group';
import { FilterOperator, PaginateConfig, SelectOneConfig, copyConfig } from '@app/shared';

export class CreateMembershipRequestDto {}

export class UpdateMembershipRequestDto extends CreateMembershipRequestDto {}

export const MembershipRequestPageConfigDto: PaginateConfig<MembershipRequestEntity> = {
  sortableColumns: ['requestDate', 'status'],
  searchableColumns: [],
  defaultSortBy: [['requestDate', 'DESC']],
  select: [
    'requestDate',
    'status',
    'user.id',
    'user.firstName',
    'user.lastName',
    'group.id',
    'group.name',
    'votes.id',
    'votes.vote',
    'votes.voter.id',
    'votes.voter.firstName',
    'votes.voter.lastName',
  ],
  filterableColumns: {
    requestDate: [FilterOperator.GT, FilterOperator.LT],
    status: [FilterOperator.EQ],
    userId: [FilterOperator.EQ],
    groupId: [FilterOperator.EQ],
  },
};

export const MembershipRequestSelectOneConfigDto = copyConfig(MembershipRequestPageConfigDto) as SelectOneConfig<MembershipRequestEntity>;
