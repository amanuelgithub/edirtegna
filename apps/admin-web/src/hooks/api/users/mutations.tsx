import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { User } from '@/core/models';
import { userKeys } from './query-keys';
import { axiosInstance } from '@/config';

export function useCreateUserMutation(
  options?: UseMutationOptions<User, AxiosError, any>,
): UseMutationResult<User, AxiosError, any> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post<User>(
        '/manage/company-users',
        payload,
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.getAllUsers(),
      });
    },
    ...options,
  });
}

export function useUpdateUserMutation(
  options?: UseMutationOptions<User, AxiosError, any>,
): UseMutationResult<User, AxiosError, any> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axiosInstance.put<User>(
        `/manage/company-users/${payload.id}`,
        payload,
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.getAllUsers(),
      });

      // TODO: it is really hard to invalidate the specific user with the pagination config options

      // queryClient.invalidateQueries({
      //   queryKey: userKeys.specificUsers(variables.pageOptions),
      // });
    },
    ...options,
  });
}
