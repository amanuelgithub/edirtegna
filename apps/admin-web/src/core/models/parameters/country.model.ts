import { BaseModel } from '../base.model';
import { City } from './city.model';
import { State } from './state.model';

export interface Country extends BaseModel {
  countryName: string;
  prefix?: string;
  icon?: string;
  isActive?: boolean;
  states?: State[];
  cities?: City[];
}
