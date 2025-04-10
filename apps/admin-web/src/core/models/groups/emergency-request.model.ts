import { RequestStatus } from '@/core/enums';

export interface EmergencyRequest {
  groupId: number;
  userId: number;
  emergencyType: string;
  description: string;
  requestDate: Date;
  status: RequestStatus;
  resolvedDate?: Date | null;
}
