import { axiosInstance } from '@/config';
import { LogoutDTO } from './types';

// list of http request methods
export const getProfile = async () => {
  const { data } = await axiosInstance.get('/app/auth/profile');
  return data;
};

export const logout = async (payload: LogoutDTO) => {
  const { data } = await axiosInstance.post<LogoutDTO, any>(
    `/app/auth/logout`,
    payload,
  );
  return data;
};
