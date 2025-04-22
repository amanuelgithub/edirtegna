import { useQuery } from '@tanstack/react-query';
import { userKeys } from './query-keys';
import { axiosInstance } from '@/config';
import { IDatasourceParameters, User } from '@/core/models';
import { DataSource } from '../base';
import { getUrl, getUrlParams } from '../base/url-builder';

// ********** QUERY OPTION DEFINITIONS ********** //
// export function createGetUsersQueryOptions(filters: UserDTO) {
//   return queryOptions({
//     queryKey: userKeys.getAllUsers(filters),
//     queryFn: getUsers,
//   });
// }
// ******** QUERY OPTION DEFINITIONS ********** //

// ********** QUERY HOOKS ********** //
// export function useListUsers(filters: Partial<UserDTO> & PaginationDTO) {
export function useListUsers(options: IDatasourceParameters) {
  // const { url, params } = useGetUrl('', options);

  return useQuery({
    // queryKey: userKeys.getAllUsers(),
    queryKey: userKeys.specificUsers(options),
    queryFn: async () => {
      const url = getUrl('/manage/company-users', options);
      const params = getUrlParams(options);
      // Push the search parameters to the browser's search field
      const currentUrl = new URL(window.location.href);
      params.forEach((value, key) => {
        currentUrl.searchParams.set(key, value);
      });
      window.history.replaceState({}, '', currentUrl);

      const { data } = await axiosInstance.get<DataSource<User>>(url);
      return data;
    },
  });
}

// export function useListUsers(options: PaginationType) {
//   return useQuery({
//     // queryKey: userKeys.getAllUsers(),
//     queryKey: userKeys.specificUsers(options),
//     queryFn: async () => {
//       const params = new URLSearchParams({
//         page: String(options.page),
//         limit: String(options.limit),
//         sortBy: `${options.sort ?? 'id'}:${options.order ?? 'DESC'}`,
//         search: options.search ?? '',
//         // filter: JSON.stringify(filters.filter ?? {}),
//       });

//       // Push the search parameters to the browser's search field
//       const url = new URL(window.location.href);
//       params.forEach((value, key) => {
//         url.searchParams.set(key, value);
//       });
//       window.history.replaceState({}, '', url);

//       const { data } = await axiosInstance.get<DataSource<User>>(
//         `/manage/company-users?`,
//         {
//           params,
//         },
//       );
//       return data;
//     },
//   });
// }

export function useGetUserById(id?: number) {
  return useQuery({
    queryKey: userKeys.getUserById(id),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/manage/company-users/${id}`);
      return data?.data;
    },
    enabled: !!id, // Only fetch if `id` is provided
  });
}
// ********** QUERY HOOKS ********** //
