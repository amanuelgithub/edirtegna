import { axiosInstance } from '@/config';
import { UserType } from './types';
import { User } from '@/core/models';

export const getUsers = async () => {
  const { data } = await axiosInstance.get<User[]>(`/manage/company-users`);
  return data;
};

export const createUser = async (payload: UserType) => {
  const { data } = await axiosInstance.post<UserType, any>(
    `/manage/company-users`,
    payload,
  );
  return data;
};

export const getUser = async (id: number) => {
  const { data } = await axiosInstance.get<User>(`/manage/company-users/${id}`);
  return data;
};

export const updateUser = async (id: number, payload: UserType) => {
  const { data } = await axiosInstance.put<UserType, any>(
    `/manage/company-users/${id}`,
    payload,
  );
  return data;
};
