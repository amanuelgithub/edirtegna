import { ContributionEntity } from '@app/db/group';
import { FilterOperator, PaginateConfig, SelectOneConfig, copyConfig } from '@app/shared';

export class CreateContributionDto {}

export class UpdateContributionDto extends CreateContributionDto {}

export const ContributionPageConfigDto: PaginateConfig<ContributionEntity> = {
  sortableColumns: ['contributionDate', 'amount', 'frequency', 'status'],
  searchableColumns: ['paymentMethod'],
  defaultSortBy: [['contributionDate', 'DESC']],
  select: [
    'amount',
    'contributionDate',
    'frequency',
    'paymentMethod',
    'status',
    'membership.id',
    'membership.user.id',
    'membership.user.firstName',
    'membership.user.lastName',
    'membership.group.id',
    'membership.group.name',
  ],
  filterableColumns: {
    contributionDate: [FilterOperator.GT, FilterOperator.LT],
    amount: [FilterOperator.GT, FilterOperator.LT, FilterOperator.EQ],
    frequency: [FilterOperator.EQ],
    paymentMethod: [FilterOperator.ILIKE],
    status: [FilterOperator.EQ],
    membershipId: [FilterOperator.EQ],
  },
};

export const ContributionSelectOneConfigDto = copyConfig(ContributionPageConfigDto) as SelectOneConfig<ContributionEntity>;
