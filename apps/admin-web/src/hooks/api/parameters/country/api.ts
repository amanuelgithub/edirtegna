import { axiosInstance } from '@/config';
import { CountryType } from './types';
import { Country } from '@/core/models';

export const getCountries = async () => {
  const { data } = await axiosInstance.get<Country[]>(`/manage/country`);
  return data;
};

export const createCountry = async (payload: CountryType) => {
  const { data } = await axiosInstance.post<CountryType, any>(
    `/manage/country`,
    payload,
  );
  return data;
};

export const getCountry = async (id: number) => {
  const { data } = await axiosInstance.get<Country>(`/manage/country/${id}`);
  return data;
};

export const updateCountry = async (id: number, payload: CountryType) => {
  const { data } = await axiosInstance.put<CountryType, any>(
    `/manage/country/${id}`,
    payload,
  );
  return data;
};
