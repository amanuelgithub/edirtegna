import { BaseModel } from '../base.model';
import {
  Group,
  GroupMembership,
  FinancialTransaction,
  Message,
  EmergencyRequest,
  DigitalArchive,
  PaymentTransaction,
  MembershipRequest,
  MembershipRequestVote,
  MemberRelative,
  MemberRelativeAdditionRequest,
} from '../groups';
import { ActivityLog } from './activity-log.model';
import { Role } from './role.model';
import { UserAccess } from './user-access.model';
import { UserProfile } from './user-profile.model';

export interface User extends BaseModel {
  idpId: string;
  email?: string;
  phone?: string;
  registrationProvider: string;
  socialProfileId?: string;
  realm: string;
  roleId: number;
  createdBy?: number;
  status: string;
  userProfileId?: number;
  role?: Role;
  userProfile?: UserProfile;
  userAccesses?: UserAccess[];
  activityLogs?: ActivityLog[];
  ledGroups?: Group[];
  groupMemberships?: GroupMembership[];
  createdTransactions?: FinancialTransaction[];
  approvedTransactions?: FinancialTransaction[];
  createdEvents?: Event[];
  messages?: Message[];
  emergencyRequests?: EmergencyRequest[];
  uploadedArchives?: DigitalArchive[];
  paymentTransactions?: PaymentTransaction[];
  membershipRequests?: MembershipRequest[];
  membershipRequestVotes?: MembershipRequestVote[];
  createdRelatives?: MemberRelative[];
  processedRelativeAdditionRequests?: MemberRelativeAdditionRequest[];
}
