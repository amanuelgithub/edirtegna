import { queryOptions, useQuery } from '@tanstack/react-query';
import { countryKeys } from './query-keys';
import { axiosInstance } from '@/config';
import { Country, IDatasourceParameters } from '@/core/models';
import { DataSource, getUrl, getUrlParams } from '../../base';

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
export function useListCountries(options: IDatasourceParameters) {
  return useQuery({
    // queryKey: countryKeys.getAllCountries(),
    queryKey: countryKeys.specificCountries(options),
    queryFn: async () => {
      const url = getUrl('/manage/countries', options);

      const params = getUrlParams(options);
      // Push the search parameters to the browser's search field
      const currentUrl = new URL(window.location.href);
      params.forEach((value, key) => {
        currentUrl.searchParams.set(key, value);
      });
      window.history.replaceState({}, '', currentUrl);

      const { data } = await axiosInstance.get<DataSource<Country>>(url);
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
