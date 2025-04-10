import { RequestStatus } from '@/core/enums';
import { MembershipRequestVote } from './membership-request-vote.model';

export interface MembershipRequest {
  userId: number;
  groupId: number;
  requestDate: Date;
  status: RequestStatus;
  votes: MembershipRequestVote[];
}
