import { EnumValues } from './enum-type';

export const USER_STATUS = {
  SELF_REG: 'SELF_REG',
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
  SUSPENDED: 'SUSPENDED',
} as const;
export type UserStatus = EnumValues<typeof USER_STATUS>;
export const EMPLOYEE_TYPE = {
  PERMANENT: 'PERMANENT',
  CONTRACT: 'CONTRACT',
  TEMPORARY: 'TEMPORARY',
} as const;
export type EmployeeType = EnumValues<typeof EMPLOYEE_TYPE>;

export const EMPLOYEE_STATUS = {
  ACTIVE: 'ACTIVE',
  RESIGNED: 'RESIGNED',
  FIRED: 'FIRED',
} as const;
export type EmployeeStatus = EnumValues<typeof EMPLOYEE_STATUS>;

export const EMPLOYEE_DESIGNATION = {
  SALES: 'SALES',
  MANAGER: 'MANAGER',
  TEMPORARY: 'TEMPORARY',
} as const;
export type EmployeeDesignation = EnumValues<typeof EMPLOYEE_TYPE>;

export const USER_ACCESS_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
  SUSPENDED: 'SUSPENDED',
  VERIFIED: 'VERIFIED',
} as const;
export type UserAccessStatus = EnumValues<typeof USER_ACCESS_STATUS>;

export const ACCESS_DEVICE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  REMOVED: 'REMOVED',
} as const;
export type AccessDeviceStatus = EnumValues<typeof ACCESS_DEVICE_STATUS>;

export const ACCESS_TYPE = {
  LOCAL: 'LOCAL',
  SOCIAL: 'SOCIAL',
} as const;
export type AccessType = EnumValues<typeof ACCESS_TYPE>;

export const REGISTRATION_PROVIDER = {
  GOOGLE: 'GOOGLE',
  FACEBOOK: 'FACEBOOK',
  TWITTER: 'TWITTER',
  TELEGRAM: 'TELEGRAM',
  LOCAL: 'LOCAL',
} as const;
export type RegistrationProvider = EnumValues<typeof REGISTRATION_PROVIDER>;
