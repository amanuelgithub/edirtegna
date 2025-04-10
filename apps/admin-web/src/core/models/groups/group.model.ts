import { DigitalArchive } from './digital-archive.model';
import { EmergencyRequest } from './emergency-request.model';
import { FinancialTransaction } from './financial-transaction.model';
import { GroupMembership } from './group-membership.model';
import { MembershipRequest } from './membership-request.model';
import { Message } from './message.model';

export interface Group {
  name: string;
  description: string;
  location: string;
  bylaws: string;
  leaderId: number;
  createdAt: Date;
  updatedAt: Date;
  memberships?: GroupMembership[];
  transactions?: FinancialTransaction[];
  events?: Event[];
  messages?: Message[];
  emergencyRequests?: EmergencyRequest[];
  archives?: DigitalArchive[];
  membershipRequests?: MembershipRequest[];
}
