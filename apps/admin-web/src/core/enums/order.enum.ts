import { EnumValues } from './enum-type';

export const ORDER = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;
export type Order = EnumValues<typeof ORDER>;
