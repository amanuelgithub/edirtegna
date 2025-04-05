import { MemberRelativeEntity } from '@app/db/group';
import { FilterOperator, PaginateConfig, SelectOneConfig, copyConfig } from '@app/shared';

export class CreateMemberRelativeDto {}

export class UpdateMemberRelativeDto extends CreateMemberRelativeDto {}

export const MemberRelativePageConfigDto: PaginateConfig<MemberRelativeEntity> = {
  sortableColumns: ['firstName', 'lastName', 'relationship', 'registeredAt'],
  searchableColumns: ['firstName', 'lastName', 'relationship'],
  defaultSortBy: [['registeredAt', 'DESC']],
  select: [
    'firstName',
    'lastName',
    'relationship',
    'dateOfBirth',
    'registeredAt',
    'membership.id',
    'membership.user.id',
    'membership.user.firstName',
    'membership.user.lastName',
    'membership.group.id',
    'membership.group.name',
    'createdBy.id',
    'createdBy.firstName',
    'createdBy.lastName',
  ],
  filterableColumns: {
    firstName: [FilterOperator.ILIKE],
    lastName: [FilterOperator.ILIKE],
    relationship: [FilterOperator.ILIKE],
    registeredAt: [FilterOperator.GT, FilterOperator.LT],
    membershipId: [FilterOperator.EQ],
    createdById: [FilterOperator.EQ],
  },
};

export const MemberRelativeSelectOneConfigDto = copyConfig(MemberRelativePageConfigDto) as SelectOneConfig<MemberRelativeEntity>;
