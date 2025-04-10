import { PaymentStatus, PaymentType } from '@/core/enums';

export interface PaymentTransaction {
  userId: number;
  externalTxnId: string;
  amount: number;
  transactionType: PaymentType;
  status: PaymentStatus;
  createdAt: Date;
  createdById: number;
  approvedById: number | null;
}
