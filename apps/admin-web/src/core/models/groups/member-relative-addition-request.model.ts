import { RequestStatus } from '@/core/enums';

export interface MemberRelativeAdditionRequest {
  membershipId: number;
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth: Date | null;
  requestDate: Date;
  status: RequestStatus;
  processedById: number | null;
  processedDate: Date | null;
}
