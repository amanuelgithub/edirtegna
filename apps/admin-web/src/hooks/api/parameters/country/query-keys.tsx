import { PaginationDTO } from '../../base';

// define the query keys here
export const countryKeys = {
  getAllCountries: () => ['countries'] as const,
  specificCountries: (pageOptions: PaginationDTO) =>
    // specificCountries: ({ page, limit }: { page: number; limit: number }) =>
    [...countryKeys.getAllCountries(), pageOptions] as const,
  getCountry: (id: number) => ['country', id] as const,
};
