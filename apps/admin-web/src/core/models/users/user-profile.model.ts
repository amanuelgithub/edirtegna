import { User } from './user.model';

export interface UserProfile {
  id: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  nationalId?: string;
  address?: string;
  profilePic?: string;
  stateId?: number;
  cityId?: number;
  user: User; // Assuming User is defined in user.model.ts
}
