import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { City } from '@/core/models';
import { cityKeys } from './query-keys';
import { axiosInstance } from '@/config';

export function useCreateCityMutation(
  options?: UseMutationOptions<City, AxiosError, any>,
): UseMutationResult<City, AxiosError, any> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post<City>(
        '/manage/cities',
        payload,
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: cityKeys.getAllCities(),
      });
    },
    ...options,
  });
}

export function useUpdateCityMutation(
  options?: UseMutationOptions<City, AxiosError, any>,
): UseMutationResult<City, AxiosError, any> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axiosInstance.put<City>(
        `/manage/cities/${payload.id}`,
        payload,
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: cityKeys.getAllCities(),
      });

      // TODO: it is really hard to invalidate the specific city with the pagination config options

      // queryClient.invalidateQueries({
      //   queryKey: cityKeys.specificCities(variables.pageOptions),
      // });
    },
    ...options,
  });
}
