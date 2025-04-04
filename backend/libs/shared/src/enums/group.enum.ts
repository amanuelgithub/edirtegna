import { EnumValues } from './enum-type';

export const GROUP_ROLE = {
  MEMBER: 'member',
  ADMIN: 'admin',
  LEADER: 'leader',
} as const;
export type GroupRole = EnumValues<typeof GROUP_ROLE>;

export const MEMBERSHIP_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;
export type MembershipStatus = EnumValues<typeof MEMBERSHIP_STATUS>;

export const CONTRIBUTION_FREQUENCY = {
  ONE_TIME: 'one_time',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  ANNUALLY: 'annually',
} as const;
export type ContributionFrequency = EnumValues<typeof CONTRIBUTION_FREQUENCY>;

export const CONTRIBUTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;
export type ContributionStatus = EnumValues<typeof CONTRIBUTION_STATUS>;

export const TRANSACTION_TYPE = {
  CONTRIBUTION: 'contribution',
  EXPENSE: 'expense',
  DONATION: 'donation',
} as const;
export type TransactionType = EnumValues<typeof TRANSACTION_TYPE>;

export const EVENT_TYPE = {
  MEETING: 'meeting',
  MEMORIAL: 'memorial',
  SOCIAL: 'social',
  EMERGENCY: 'emergency',
} as const;
export type EventType = EnumValues<typeof EVENT_TYPE>;

export const REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  RESOLVED: 'resolved',
  DENIED: 'denied',
} as const;
export type RequestStatus = EnumValues<typeof REQUEST_STATUS>;

export const PAYMENT_TYPE = {
  CONTRIBUTION: 'contribution',
  DONATION: 'donation',
} as const;
export type PaymentType = EnumValues<typeof PAYMENT_TYPE>;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;
export type PaymentStatus = EnumValues<typeof PAYMENT_STATUS>;
