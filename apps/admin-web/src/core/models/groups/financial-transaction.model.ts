import { TransactionType } from '@/core/enums';

export interface FinancialTransaction {
  groupId: number;
  transactionType: TransactionType;
  amount: number;
  description: string;
  transactionDate: Date;
  createdById: number;
  approvedById: number;
}
