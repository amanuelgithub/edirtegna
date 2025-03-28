import { EnumValues } from './enum-type';

export const WALLET_TYPE = { MAIN: 'MAIN', COMMISSION: 'COMMISSION' } as const;
export type WalletType = EnumValues<typeof WALLET_TYPE>;
