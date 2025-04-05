import { GroupEntity } from './group.entity';
import { GroupMembershipEntity } from './group-membership.entity';
import { ContributionEntity } from './contribution.entity';
import { FinancialTransactionEntity } from './financial-transaction.entity';
import { EventEntity } from './event.entity';
import { MessageEntity } from './message.entity';
import { EmergencyRequestEntity } from './emergency-request.entity';
import { DigitalArchiveEntity } from './digital-archive.entity';
import { PaymentTransactionEntity } from './payment-transaction.entity';
import { MembershipRequestEntity } from './membership-request.entity';
import { MembershipRequestVoteEntity } from './membership-request-vote.entity';
import { MemberRelativeAdditionRequestEntity } from './member-relative-addition-request.entity';
import { MemberRelativeEntity } from './member-relatives.entity';

export * from './group.entity';
export * from './group-membership.entity';
export * from './contribution.entity';
export * from './financial-transaction.entity';
export * from './event.entity';
export * from './message.entity';
export * from './emergency-request.entity';
export * from './digital-archive.entity';
export * from './payment-transaction.entity';
export * from './membership-request.entity';
export * from './membership-request-vote.entity';
export * from './member-relatives.entity';
export * from './member-relative-addition-request.entity';

export const GROUP_ENTITIES = [
  GroupEntity,
  GroupMembershipEntity,
  ContributionEntity,
  FinancialTransactionEntity,
  EventEntity,
  MessageEntity,
  EmergencyRequestEntity,
  DigitalArchiveEntity,
  PaymentTransactionEntity,
  MembershipRequestEntity,
  MembershipRequestVoteEntity,
  MemberRelativeEntity,
  MemberRelativeAdditionRequestEntity,
];
