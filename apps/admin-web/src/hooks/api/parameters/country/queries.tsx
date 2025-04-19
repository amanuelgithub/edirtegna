import { useQuery } from '@tanstack/react-query';
import { countryKeys } from './query-keys';
import { axiosInstance } from '@/config';
import { Country } from '@/core/models';
import { PaginationType } from '../../base';
import { DataSource } from '../../base';

// ********** QUERY OPTION DEFINITIONS ********** //
// export function createGetCountriesQueryOptions(filters: CountryDTO) {
//   return queryOptions({
//     queryKey: countryKeys.getAllCountries(filters),
//     queryFn: getCountries,
//   });
// }
// ******** QUERY OPTION DEFINITIONS ********** //

// ********** QUERY HOOKS ********** //
// export function useListCountries(filters: Partial<CountryDTO> & PaginationDTO) {
export function useListCountries(options: PaginationType) {
  return useQuery({
    queryKey: countryKeys.specificCountries(options),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(options.page),
        limit: String(options.limit),
        sortBy: `${options.sort ?? 'id'}:${options.order ?? 'DESC'}`,
        search: options.search ?? '',
        // filter: JSON.stringify(filters.filter ?? {}),
      });

      // Push the search parameters to the browser's search field
      const url = new URL(window.location.href);
      params.forEach((value, key) => {
        url.searchParams.set(key, value);
      });
      window.history.replaceState({}, '', url);

      const { data } = await axiosInstance.get<DataSource<Country>>(
        `/manage/countries?`,
        {
          params,
        },
      );
      return data;
    },
  });
}

export function useGetCountryById(id?: number) {
  return useQuery({
    queryKey: countryKeys.getCountryById(id),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/manage/countries/${id}`);
      return data?.data;
    },
    enabled: !!id, // Only fetch if `id` is provided
  });
}
// ********** QUERY HOOKS ********** //
