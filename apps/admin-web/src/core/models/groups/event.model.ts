import { EventType } from '@/core/enums';

export interface Event {
  groupId: number;
  title: string;
  description: string;
  eventType: EventType;
  startDateTime: Date;
  endDateTime: Date | null;
  location: string;
  createdById: number;
  createdAt: Date;
}
