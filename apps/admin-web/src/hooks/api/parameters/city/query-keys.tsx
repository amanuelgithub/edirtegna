import { PaginationType } from '../../base';

// define the query keys here
export const cityKeys = {
  getAllCities: () => ['cities'] as const,
  specificCities: (pageOptions?: PaginationType) =>
    [...cityKeys.getAllCities(), pageOptions] as const,
  getCityById: (cityId?: number) => ['cities', cityId] as const,
};
