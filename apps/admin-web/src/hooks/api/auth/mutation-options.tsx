// place to store all mutation options for the auth api

// create a mutaiton option of logout

import { UseMutationOptions, MutationOptions } from '@tanstack/react-query';
import { logout } from './api';

// export function createGetProfileQueryOptions() {
//   return queryOptions({
//     queryKey: authQueryKeys.getProfile,
//     queryFn: getProfile,
//   });
// }

export function createLogoutMutationOptions(
  options?: UseMutationOptions<any, any, any>,
): MutationOptions<any, any, any> {
  return {
    mutationFn: logout,
    ...options,
  };
}
