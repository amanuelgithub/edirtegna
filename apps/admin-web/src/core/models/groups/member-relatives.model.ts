export interface MemberRelative {
  membershipId: number;
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth: Date | null;
  registeredAt: Date;
  createdById: number | null;
}
