import { UserProfile } from "../users";

// filepath: /Users/amanuel/Code/me/edirtegna/backend/libs/db/src/parameters/city.model.ts
export interface City {
  cityName: string;
  stateId: number;
  countryId: number;
  userProfiles?: UserProfile[]; // Adjust the type as necessary based on UserProfileEntity
}