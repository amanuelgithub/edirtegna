import { VoteType } from '@/core/enums';

export interface MembershipRequestVote {
  requestId: number;
  userId: number;
  vote: VoteType;
  voteDate: Date;
  internalUserReference: string | null;
}
