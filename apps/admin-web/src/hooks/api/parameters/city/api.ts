import { axiosInstance } from '@/config';
import { CityType } from './types';
import { City } from '@/core/models';

export const getCitys = async () => {
  const { data } = await axiosInstance.get<City[]>(`/manage/cities`);
  return data;
};

export const createCity = async (payload: CityType) => {
  const { data } = await axiosInstance.post<CityType, any>(
    `/manage/cities`,
    payload,
  );
  return data;
};

export const getCity = async (id: number) => {
  const { data } = await axiosInstance.get<City>(`/manage/cities/${id}`);
  return data;
};

export const updateCity = async (id: number, payload: CityType) => {
  const { data } = await axiosInstance.put<CityType, any>(
    `/manage/cities/${id}`,
    payload,
  );
  return data;
};
