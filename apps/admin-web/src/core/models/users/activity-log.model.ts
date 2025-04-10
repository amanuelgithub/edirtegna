import { User } from './user.model';

export interface ActivityLog {
  logTitle: string;
  logText: string;
  ipAddress?: string;
  ua?: string;
  userId?: number;
  user?: User; // Replace 'any' with the appropriate type for the user relationship if known
}
