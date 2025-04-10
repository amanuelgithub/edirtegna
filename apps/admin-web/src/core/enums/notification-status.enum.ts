import { EnumValues } from './enum-type';

export const NOTIFICATION_STATUS = {
  PENDING: 'PENDING',
  FAILED: 'FAILED',
  SENT: 'SENT',
  READ: 'READ',
} as const;
export type NotificationStatus = EnumValues<typeof NOTIFICATION_STATUS>;
