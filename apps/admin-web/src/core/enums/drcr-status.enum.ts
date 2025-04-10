import { EnumValues } from './enum-type';

export const DR_CR_STATUS = {
  DR: 'DR',
  CR: 'CR',
} as const;
export type DrCrStatus = EnumValues<typeof DR_CR_STATUS>;
