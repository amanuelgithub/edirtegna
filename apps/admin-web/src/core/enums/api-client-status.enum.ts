import { EnumValues } from './enum-type';

export const API_CLIENT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  REVOKED: 'REVOKED',
} as const;
export type ApiClientStatus = EnumValues<typeof API_CLIENT_STATUS>;

export const API_CLIENT_HEALTH_STATUS = {
  WORKING: 'WORKING',
  FAILING: 'FAILING',
} as const;
export type ApiClientHealthStatus = EnumValues<typeof API_CLIENT_HEALTH_STATUS>;

export const API_LOG_STATUS = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
} as const;
export type ApiLogStatus = EnumValues<typeof API_LOG_STATUS>;
