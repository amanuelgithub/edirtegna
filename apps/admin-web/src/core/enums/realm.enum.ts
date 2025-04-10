import { EnumValues } from './enum-type';

export const REALM = { ADMIN: 'ADMIN', CUSTOMER: 'CUSTOMER' } as const;
export type Realm = EnumValues<typeof REALM>;

export const ACTION_ON_RESOURCE = {
  manage: 'manage',
  create: 'create',
  update: 'update',
  read: 'read',
  'read-one': 'read-one',
  delete: 'delete',
} as const;
export type ActionOnResource = EnumValues<typeof ACTION_ON_RESOURCE>;
