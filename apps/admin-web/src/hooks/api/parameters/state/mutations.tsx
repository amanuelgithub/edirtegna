import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { State } from '@/core/models';
import { stateKeys } from './query-keys';
import { axiosInstance } from '@/config';

export function useCreateStateMutation(
  options?: UseMutationOptions<State, AxiosError, any>,
): UseMutationResult<State, AxiosError, any> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post<State>(
        '/manage/states',
        payload,
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: stateKeys.getAllStates(),
      });
    },
    ...options,
  });
}

export function useUpdateStateMutation(
  options?: UseMutationOptions<State, AxiosError, any>,
): UseMutationResult<State, AxiosError, any> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axiosInstance.put<State>(
        `/manage/states/${payload.id}`,
        payload,
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: stateKeys.getAllStates(),
      });

      // TODO: it is really hard to invalidate the specific state with the pagination config options

      // queryClient.invalidateQueries({
      //   queryKey: stateKeys.specificStates(variables.pageOptions),
      // });
    },
    ...options,
  });
}
