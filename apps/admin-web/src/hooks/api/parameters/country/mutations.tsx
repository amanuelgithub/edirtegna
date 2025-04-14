// import {
//   useMutation,
//   UseMutationOptions,
//   UseMutationResult,
//   useQueryClient,
// } from '@tanstack/react-query';
// import { AxiosError } from 'axios';
// import { CountryDTO } from './types';
// import { Country } from '@/core/models';
// import { createCountry } from './api';
// import { countryKeys } from './query-keys';

// export function useCreateCountryMutation(
//   filters: CountryDTO,
//   options?: UseMutationOptions<Country, AxiosError, CountryDTO>,
// ): UseMutationResult<Country, AxiosError, CountryDTO> {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: createCountry,
//     ...options,
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: countryKeys.getAllCountries(filters),
//       });
//     },
//   });
// }
