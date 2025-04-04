export enum GroupRole {
  MEMBER = 'member',
  ADMIN = 'admin',
  LEADER = 'leader',
}

export enum MembershipStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ContributionFrequency {
  ONE_TIME = 'one_time',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  ANNUALLY = 'annually',
}

export enum ContributionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum TransactionType {
  CONTRIBUTION = 'contribution',
  EXPENSE = 'expense',
  DONATION = 'donation',
}

export enum EventType {
  MEETING = 'meeting',
  MEMORIAL = 'memorial',
  SOCIAL = 'social',
  EMERGENCY = 'emergency',
}

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  RESOLVED = 'resolved',
  DENIED = 'denied',
}

export enum PaymentType {
  CONTRIBUTION = 'contribution',
  DONATION = 'donation',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}
