import { MemberRelativeAdditionRequestEntity } from '@app/db/group';
import { FilterOperator, PaginateConfig, SelectOneConfig, copyConfig } from '@app/shared';

export class CreateMemberRelativeAdditionRequestDto {}

export class UpdateMemberRelativeAdditionRequestDto extends CreateMemberRelativeAdditionRequestDto {}

export const MemberRelativeAdditionRequestPageConfigDto: PaginateConfig<MemberRelativeAdditionRequestEntity> = {
  sortableColumns: ['firstName', 'lastName', 'relationship', 'requestDate', 'status'],
  searchableColumns: ['firstName', 'lastName', 'relationship'],
  defaultSortBy: [['requestDate', 'DESC']],
  select: [
    'firstName',
    'lastName',
    'relationship',
    'dateOfBirth',
    'requestDate',
    'status',
    'membership.id',
    'membership.user.id',
    'membership.user.firstName',
    'membership.user.lastName',
    'membership.group.id',
    'membership.group.name',
    'processedBy.id',
    'processedBy.firstName',
    'processedBy.lastName',
    'processedDate',
  ],
  filterableColumns: {
    firstName: [FilterOperator.ILIKE],
    lastName: [FilterOperator.ILIKE],
    relationship: [FilterOperator.ILIKE],
    requestDate: [FilterOperator.GT, FilterOperator.LT],
    status: [FilterOperator.EQ],
    membershipId: [FilterOperator.EQ],
    processedById: [FilterOperator.EQ],
  },
};

export const MemberRelativeAdditionRequestSelectOneConfigDto = copyConfig(MemberRelativeAdditionRequestPageConfigDto) as SelectOneConfig<MemberRelativeAdditionRequestEntity>;
