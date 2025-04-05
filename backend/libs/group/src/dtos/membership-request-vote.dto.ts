import { MembershipRequestVoteEntity } from '@app/db/group';
import { FilterOperator, PaginateConfig, SelectOneConfig, copyConfig } from '@app/shared';

export class CreateMembershipRequestVoteDto {}

export class UpdateMembershipRequestVoteDto extends CreateMembershipRequestVoteDto {}

export const MembershipRequestVotePageConfigDto: PaginateConfig<MembershipRequestVoteEntity> = {
  sortableColumns: ['id', 'vote', 'voteDate', 'internalUserReference', 'request.id', 'request.status', 'user.id'],
  searchableColumns: ['internalUserReference'],
  defaultSortBy: [['voteDate', 'DESC']],
  select: [
    'id',
    'vote',
    'voteDate',
    'internalUserReference',
    'request.id',
    'request.status',
    'request.user.id',
    'request.user.firstName',
    'request.user.lastName',
    'request.group.id',
    'request.group.name',
    'user.id',
    'user.firstName',
    'user.lastName',
  ],
  filterableColumns: {
    voteDate: [FilterOperator.GT, FilterOperator.LT],
    vote: [FilterOperator.EQ],
    internalUserReference: [FilterOperator.ILIKE],
    requestId: [FilterOperator.EQ],
    userId: [FilterOperator.EQ],
  },
};

export const MembershipRequestVoteSelectOneConfigDto = copyConfig(MembershipRequestVotePageConfigDto) as SelectOneConfig<MembershipRequestVoteEntity>;
