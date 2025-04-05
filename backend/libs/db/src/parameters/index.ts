import { CityEntity } from './city.entity';
import { StateEntity } from './state.entity';
import { CountryEntity } from './country.entity';

export * from './city.entity';
export * from './state.entity';
export * from './country.entity';

export const PARAMETER_ENTITIES = [CityEntity, StateEntity, CountryEntity];
