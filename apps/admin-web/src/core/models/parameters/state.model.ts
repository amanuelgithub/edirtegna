import { BaseModel } from '../base.model';
import { UserProfile } from '../users';
import { City } from './city.model';
import { Country } from './country.model';

export interface State extends BaseModel {
  stateName: string;
  userProfiles?: UserProfile[];
  cities?: City[];
  countryId: number;
  country: Country;
}
