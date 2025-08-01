import { queryOptions, useQuery } from '@tanstack/react-query';
import { stateKeys } from './query-keys';
import { axiosInstance } from '@/config';
import { IDatasourceParameters, State } from '@/core/models';
import { getUrl, PaginationType, DataSource } from '../../base';

// ********** QUERY OPTION DEFINITIONS ********** //
export function createGetStatesQueryOptions(
  options: IDatasourceParameters,
  // options: PaginationType & StateType,
) {
  return queryOptions({
    queryKey: stateKeys.getAllStates(),
    queryFn: async () => {
      const url = getUrl('/manage/states', options);
      const { data } = await axiosInstance.get<DataSource<State>>(url);
      return data;
    },
  });
}
// ******** QUERY OPTION DEFINITIONS ********** //

// ********** QUERY HOOKS ********** //
// export function useListStates(filters: Partial<StateDTO> & PaginationDTO) {
export function useListStates(options: PaginationType) {
  return useQuery({
    // queryKey: stateKeys.getAllStates(),
    queryKey: stateKeys.specificStates(options),
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

      const { data } = await axiosInstance.get<DataSource<State>>(
        `/manage/states?`,
        {
          params,
        },
      );
      return data;
    },
  });
}

export function useGetStateById(id?: number) {
  return useQuery({
    queryKey: stateKeys.getStateById(id),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/manage/states/${id}`);
      return data?.data;
    },
    enabled: !!id, // Only fetch if `id` is provided
  });
}
// ********** QUERY HOOKS ********** //
