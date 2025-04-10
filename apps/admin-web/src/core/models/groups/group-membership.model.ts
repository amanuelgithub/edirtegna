import { GroupRole, MembershipStatus } from '@/core/enums';
import { Contribution } from './contribution.model';
import { MemberRelative } from './member-relatives.model';
import { MemberRelativeAdditionRequest } from './member-relative-addition-request.model';

export interface GroupMembership {
  userId: number;
  groupId: number;
  joinDate: Date;
  role: GroupRole;
  status: MembershipStatus;
  contributions: Contribution[];
  relatives: MemberRelative[];
  relativeAdditionRequests: MemberRelativeAdditionRequest[];
}
