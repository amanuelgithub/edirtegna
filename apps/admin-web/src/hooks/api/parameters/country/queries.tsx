import { queryOptions, useQuery } from '@tanstack/react-query';
import { countryKeys } from './query-keys';
import { axiosInstance } from '@/config';
import { Country, IDatasourceParameters } from '@/core/models';
import { getUrl, PaginationType } from '../../base';
import { DataSource } from '../../base';

// ********** QUERY OPTION DEFINITIONS ********** //
export function createGetCountriesQueryOptions(options: IDatasourceParameters) {
  return queryOptions({
    queryKey: countryKeys.getAllCountries(),
    queryFn: async () => {
      const url = getUrl('/manage/countries', options);
      const { data } = await axiosInstance.get<DataSource<Country>>(url);
      return data;
    },
  });
}
// ******** QUERY OPTION DEFINITIONS ********** //

// ********** QUERY HOOKS ********** //
// export function useListCountries(filters: Partial<CountryDTO> & PaginationDTO) {
export function useListCountries(options: PaginationType) {
  return useQuery({
    // queryKey: countryKeys.getAllCountries(),
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
    // staleTime: 1000, // 5 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes
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
