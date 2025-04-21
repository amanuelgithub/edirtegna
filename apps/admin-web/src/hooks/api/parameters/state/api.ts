import { axiosInstance } from '@/config';
import { StateType } from './types';
import { State } from '@/core/models';

export const getStates = async () => {
  const { data } = await axiosInstance.get<State[]>(`/manage/state`);
  return data;
};

export const createState = async (payload: StateType) => {
  const { data } = await axiosInstance.post<StateType, any>(
    `/manage/state`,
    payload,
  );
  return data;
};

export const getState = async (id: number) => {
  const { data } = await axiosInstance.get<State>(`/manage/state/${id}`);
  return data;
};

export const updateState = async (id: number, payload: StateType) => {
  const { data } = await axiosInstance.put<StateType, any>(
    `/manage/state/${id}`,
    payload,
  );
  return data;
};
