import { ContributionFrequency, ContributionStatus } from '@/core/enums';

export interface Contribution {
  membershipId: number;
  amount: number;
  contributionDate: Date;
  frequency: ContributionFrequency;
  paymentMethod: string;
  status: ContributionStatus;
}
