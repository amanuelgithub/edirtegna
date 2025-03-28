import { DrCrStatus } from '@app/shared';

export interface IWalletTransactionNotification {
  fullName: string;
  amount: number;
  balance: number;
  userId: number;
  phone?: string;
  email?: string;
  transactionType: DrCrStatus;
}
