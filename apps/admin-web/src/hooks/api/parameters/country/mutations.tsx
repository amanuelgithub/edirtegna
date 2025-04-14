import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { CountryDTO } from './types';
import { Country } from '@/core/models';
import { countryKeys } from './query-keys';
import { PaginationType } from '../../base';
import { message } from 'antd';
import { axiosInstance } from '@/config';

export function useCreateCountryMutation(
  options?: UseMutationOptions<Country, AxiosError, any>,
): UseMutationResult<Country, AxiosError, any> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axiosInstance.post<Country>(
        '/manage/countries',
        payload,
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: countryKeys.specificCountries(variables.pageOptions),
      });
      // show toast message
      message.success('Country created successfully!');
    },
    ...options,
  });
}

export function useUpdateCountryMutation(
  //   countryId: number,
  //   pageOptions: PaginationType,
  options?: UseMutationOptions<Country, AxiosError, any>,
): UseMutationResult<Country, AxiosError, any> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axiosInstance.put<Country>(
        `/manage/countries/${payload.countryId}`,
        payload,
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: countryKeys.specificCountries(variables.pageOptions),
      });
      // show toast message
      message.success('Country updated successfully!');
    },
    ...options,
  });
}
