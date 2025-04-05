import { PaymentTransactionEntity } from '@app/db/group';
import { FilterOperator, PaginateConfig, SelectOneConfig, copyConfig } from '@app/shared';

export class CreatePaymentTransactionDto {}

export class UpdatePaymentTransactionDto extends CreatePaymentTransactionDto {}

export const PaymentTransactionPageConfigDto: PaginateConfig<PaymentTransactionEntity> = {
  sortableColumns: ['id', 'externalTxnId', 'amount', 'transactionType', 'status', 'createdAt', 'user.id'],
  searchableColumns: ['externalTxnId'],
  defaultSortBy: [['createdAt', 'DESC']],
  select: ['id', 'externalTxnId', 'amount', 'transactionType', 'status', 'createdAt', 'user.id', 'user.firstName', 'user.lastName'],
  filterableColumns: {
    createdAt: [FilterOperator.GT, FilterOperator.LT],
    amount: [FilterOperator.GT, FilterOperator.LT, FilterOperator.EQ],
    transactionType: [FilterOperator.EQ],
    status: [FilterOperator.EQ],
    userId: [FilterOperator.EQ],
  },
};

export const PaymentTransactionSelectOneConfigDto = copyConfig(PaymentTransactionPageConfigDto) as SelectOneConfig<PaymentTransactionEntity>;
