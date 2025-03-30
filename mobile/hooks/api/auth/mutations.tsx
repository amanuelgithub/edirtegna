// create a login mutation using tanstack query
import { useMutation } from '@tanstack/react-query';
// import { axiosInstance } from '@/config/request';
import axiosInstance from '@/config/request';
import axios from 'axios';

// import { API_URL } from '@/config/env';
import {
  LoginDTO,
  RegisterDTO,
  VerifyOtpDTO,
  SetPasswordDTO,
  ForgotPasswordDTO,
  ChangePasswordDTO,
  ResendOtpDTO,
  LogoutDTO,
} from './types';

export const seedRoles = async () => {
  // const { data } = await axios.get(
  //   'https://jsonplaceholder.typicode.com/posts'
  // );
  // console.log('posts: ', data);
  // return data;
  console.log('test 1');

  const res = await axios.get('http://localhost:3000/api/v1/', {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('test 2');

  console.log('Seed roles response:', res);

  return res.data;
};

export const login = async (payload: LoginDTO) => {
  console.log('test 1');
  const { data } = await axiosInstance.post<LoginDTO>(
    `/app/auth/login`,
    payload
  );

  // const { data } = await axios.post<LoginDTO>(
  //   `http://localhost:3000/api/v1/app/auth/login`,
  //   payload
  // );

  console.log('test 2');
  // return res;
  return data;
};

export const register = async (payload: RegisterDTO) => {
  const { data } = await axiosInstance.post<RegisterDTO>(
    `/app/auth/register`,
    payload
  );
  return data;
};

export const verifyOtp = async (payload: VerifyOtpDTO) => {
  const { data } = await axiosInstance.post<VerifyOtpDTO>(
    `/app/auth/verify-otp`,
    payload
  );
  return data;
};

export const setPassword = async (payload: SetPasswordDTO) => {
  const { data } = await axiosInstance.post<SetPasswordDTO>(
    `/app/auth/set-password`,
    payload
  );
  return data;
};

export const forgotPassword = async (payload: ForgotPasswordDTO) => {
  const { data } = await axiosInstance.post<ForgotPasswordDTO>(
    `/app/auth/forgot-password`,
    payload
  );
  return data;
};

export const resendOtp = async (payload: ResendOtpDTO) => {
  const { data } = await axiosInstance.post<ResendOtpDTO>(
    `/app/auth/resend-otp`,
    payload
  );
  return data;
};

export const logout = async (payload: LogoutDTO) => {
  const { data } = await axiosInstance.post<LogoutDTO>(`/app/auth/logout`);
  return data;
};

// export const deleteAccount = async () => {
//   const response = await axios.post(`${API_URL}/app/auth/delete-account`);
//   return response.payload;
// };

export const updateProfile = async (payload: {
  name: string;
  email: string;
}) => {
  const { data } = await axiosInstance.post(
    `/app/auth/update-profile`,
    payload
  );
  return data;
};

export const changePassword = async (payload: ChangePasswordDTO) => {
  const { data } = await axiosInstance.post<ChangePasswordDTO>(
    `/app/auth/change-password`,
    payload
  );
  return data;
};

export const useLoginMutation = () => {
  return useMutation({
    // mutationFn: async (payload: LoginDTO) => {
    //   return axiosInstance.post<LoginDTO>(`/app/auth/login`, payload);
    //   // return axiosInstance.post<LoginDTO>(`/test`, payload);
    // },

    mutationFn: login,
    // mutationFn: async (data: LoginDTO) => {
    //   return login(data);
    // },
    onSuccess: (payload) => {
      console.log('Login successful:', payload);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: register,
  });
};

export const useSetPasswordMutation = () => {
  return useMutation({
    mutationFn: setPassword,
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: verifyOtp,
  });
};

export const useResendOtpMutation = () => {
  return useMutation({
    mutationFn: resendOtp,
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: logout,
  });
};

// export const useUpdateProfileMutation = () => {
//   return useMutation({
//     mutationFn: async (payload: { name: string; email: string }) => {
//       const response = await axios.post(`${API_URL}auth/update-profile`, payload);
//       return response.payload;
//     },
//   });
// };

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};

// export const useDeleteAccountMutation = () => {
//   return useMutation({
//     mutationFn: async () => {
//       const response = await axios.post(`${API_URL}auth/delete-account`);
//       return response.payload;
//     },
//   });
// };
