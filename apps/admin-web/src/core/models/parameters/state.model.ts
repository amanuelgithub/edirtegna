import { UserProfile } from '../users';
import { City } from './city.model';
import { Country } from './country.model';

export interface State {
  stateName: string;
  userProfiles?: UserProfile[];
  cities?: City[];
  countryId: number;
  country: Country;
}
