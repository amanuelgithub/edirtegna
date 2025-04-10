import { EnumValues } from './enum-type';

export const CUSTOMER_LEVEL = {
  TELEBIRR_AGENT: 'TELEBIRR_AGENT',
  TELEBIRR_SALES: 'TELEBIRR_SALES',
  AGENT: 'AGENT',
  SUB_AGENT: 'SUB_AGENT',
  RETAILER: 'RETAILER',
  SUB_RETAILER: 'SUB_RETAILER',
} as const;
export type CustomerLevel = EnumValues<typeof CUSTOMER_LEVEL>;
