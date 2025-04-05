import { FinancialTransactionEntity } from '@app/db/group';
import { FilterOperator, PaginateConfig, SelectOneConfig, copyConfig } from '@app/shared';

export class CreateFinancialTransactionDto {}

export class UpdateFinancialTransactionDto extends CreateFinancialTransactionDto {}

export const FinancialTransactionPageConfigDto: PaginateConfig<FinancialTransactionEntity> = {
  sortableColumns: [],
  searchableColumns: ['id'],
  defaultSortBy: [['createdAt', 'DESC']],
  select: ['id', 'createdAt', 'updatedAt'],
  filterableColumns: {},
};

export const FinancialTransactionSelectOneConfigDto = copyConfig(FinancialTransactionPageConfigDto) as SelectOneConfig<FinancialTransactionEntity>;
