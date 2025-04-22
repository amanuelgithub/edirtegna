import { IDatasourceParameters } from '@/core/models';
import { PaginationType } from '../../base';

// define the query keys here
export const countryKeys = {
  getAllCountries: () => ['countries'] as const,
  specificCountries: (pageOptions: IDatasourceParameters) =>
    [...countryKeys.getAllCountries(), pageOptions] as const,
  // specificCountries: (pageOptions?: PaginationType) =>
  //   [...countryKeys.getAllCountries(), pageOptions] as const,
  getCountryById: (countryId?: number) => ['countries', countryId] as const,
};
