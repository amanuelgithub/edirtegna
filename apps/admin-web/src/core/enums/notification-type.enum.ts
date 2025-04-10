import { EnumValues } from './enum-type';

export const NOTIFICATION_TYPE = {
  SMS: 'SMS',
  EMAIL: 'EMAIL',
  API: 'API',
} as const;
export type NotificationType = EnumValues<typeof NOTIFICATION_TYPE>;
