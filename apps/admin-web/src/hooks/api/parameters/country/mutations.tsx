import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Country } from '@/core/models';
import { countryKeys } from './query-keys';
import { axiosInstance } from '@/config';

export function useCreateCountryMutation(
  options?: UseMutationOptions<Country, AxiosError, any>,
): UseMutationResult<Country, AxiosError, any> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const formData = new FormData();
      formData.append('countryName', payload.countryName);
      formData.append('shortName', payload.shortName);
      formData.append('phonePrefix', payload.phonePrefix);
      formData.append('isActive', payload.isActive ? 'true' : 'false');

      if (payload.icon && payload.icon.length > 0) {
        formData.append('icon', payload.icon[0].originFileObj);
      }

      const { data } = await axiosInstance.post<Country>(
        '/manage/countries',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: countryKeys.specificCountries(variables.pageOptions),
      });
      queryClient.invalidateQueries({
        queryKey: countryKeys.getAllCountries(),
      });
      queryClient.removeQueries({
        queryKey: countryKeys.getAllCountries(),
      });
      queryClient.clear();
      console.log('country invalidated');
    },
    ...options,
  });
}

export function useUpdateCountryMutation(
  options?: UseMutationOptions<Country, AxiosError, any>,
): UseMutationResult<Country, AxiosError, any> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const formData = new FormData();
      formData.append('countryName', payload.countryName);
      formData.append('shortName', payload.shortName);
      formData.append('phonePrefix', payload.phonePrefix);
      formData.append('isActive', payload.isActive);
      formData.append('icon', payload.icon[0].originFileObj);

      const { data } = await axiosInstance.put<Country>(
        `/manage/countries/${payload.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: countryKeys.specificCountries(variables.pageOptions),
      });
    },
    ...options,
  });
}
