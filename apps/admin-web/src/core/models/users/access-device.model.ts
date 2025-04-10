export interface AccessDevice {
  id: number;
  ua?: string;
  browser?: string;
  engine?: string;
  os?: string;
  device?: string;
  cpu?: string;
  isActive: boolean;
  deviceHash?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedDate?: Date;
  userAccessId: number;
  userAccess: UserAccess; // Assuming UserAccess is defined in user-access.model.ts
}