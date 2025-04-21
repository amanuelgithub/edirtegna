import { useQuery } from '@tanstack/react-query';
import { cityKeys } from './query-keys';
import { axiosInstance } from '@/config';
import { City } from '@/core/models';
import { PaginationType } from '../../base';
import { DataSource } from '../../base';

// ********** QUERY OPTION DEFINITIONS ********** //
// export function createGetCitiesQueryOptions(filters: CityDTO) {
//   return queryOptions({
//     queryKey: cityKeys.getAllCities(filters),
//     queryFn: getCities,
//   });
// }
// ******** QUERY OPTION DEFINITIONS ********** //

// ********** QUERY HOOKS ********** //
// export function useListCities(filters: Partial<CityDTO> & PaginationDTO) {
export function useListCities(options: PaginationType) {
  return useQuery({
    // queryKey: cityKeys.getAllCities(),
    queryKey: cityKeys.specificCities(options),
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

      const { data } = await axiosInstance.get<DataSource<City>>(
        `/manage/cities?`,
        {
          params,
        },
      );
      return data;
    },
  });
}

export function useGetCityById(id?: number) {
  return useQuery({
    queryKey: cityKeys.getCityById(id),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/manage/cities/${id}`);
      return data?.data;
    },
    enabled: !!id, // Only fetch if `id` is provided
  });
}
// ********** QUERY HOOKS ********** //
