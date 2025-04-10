import { City } from './city.model';
import { State } from './state.model';

export interface Country {
  countryName: string;
  prefix?: string;
  icon?: string;
  isActive?: boolean;
  states?: State[];
  cities?: City[];
}
