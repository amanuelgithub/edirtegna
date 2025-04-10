// filepath: /Users/amanuel/Code/me/edirtegna/backend/libs/db/src/parameters/city.model.ts
export interface City {
  cityName: string;
  stateId: number;
  countryId: number;
  userProfiles?: any[]; // Adjust the type as necessary based on UserProfileEntity
}