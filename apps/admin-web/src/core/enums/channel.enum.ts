import { EnumValues } from './enum-type';

export const CHANNEL = {
  WEB: 'WEB',
  API: 'API',
  APP: 'APP',
} as const;
export type Channel = EnumValues<typeof CHANNEL>;
export const PAYMENT_CHANNEL = {
  TELEBIRR: 'TELEBIRR',
  BANK_CASH: 'BANK_CASH',
  BANK_LOAN: 'BANK_LOAN',
} as const;
export type PaymentChannel = EnumValues<typeof PAYMENT_CHANNEL>;
