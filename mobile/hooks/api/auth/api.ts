import axiosInstance from '@/config/request';

// list of http request methods
export const getProfile = async () => {
  const { data } = await axiosInstance.get('/app/auth/profile');
  return data;
};
