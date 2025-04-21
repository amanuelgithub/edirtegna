import { BaseModel } from '../base.model';
import { UserProfile } from '../users';

export interface City extends BaseModel {
  cityName: string;
  stateId: number;
  countryId: number;
  userProfiles?: UserProfile[]; // Adjust the type as necessary based on UserProfileEntity
}
