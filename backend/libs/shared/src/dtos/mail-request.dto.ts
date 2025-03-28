export interface IWelcomeUser {
  fullName: string;
  loginUrl: string;
  password: string;
  otpCode: number;
}
export interface IResendOtp {
  fullName: string;
  operatingSystem: string;
  browserName: string;
  supportUrl: string;
  otpCode: number;
}
export interface IResetPasswordMail {
  fullName: string;
  // resetUrl: string;
  loginUrl: string;
  password: string;

  operatingSystem: string;
  browserName: string;
  supportUrl: string;
  // validHours: number;
}
export interface IPaymentDueInvoiceMail {
  fullName: string;
  planName: string;
  totalAmount: number;
  invoiceNo: number;
  accountManagerPhone: string;
  dueDate: string;
}

// transactions

export interface IWalletTransactionMail {
  fullName: string;
  amount: number;
  balance: number;
  transactionType: any;
}

export class IEMail<T> {
  to: string;
  userId?: number;
  context?: T;
}

export interface IMailNotifier<T> {
  getMailData(): IEMail<T>;
  updateDestinationMail?(email: string): void;
}
