// place to store all mutations for the auth api
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosInstance } from '@/config';

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
import { useRouter } from 'expo-router';

export const login = async (payload: LoginDTO) => {
  console.log('test 1');
  const { data } = await axiosInstance.post<LoginDTO, any>(
    `/app/auth/login`,
    payload,
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
  const { data } = await axiosInstance.post<RegisterDTO, any>(
    `/app/auth/register`,
    payload,
  );
  return data;
};

export const verifyOtp = async (payload: VerifyOtpDTO) => {
  const res = await axiosInstance.post<VerifyOtpDTO, any>(
    `/app/auth/verify-otp`,
    payload,
  );
  return res;
};

export const setPassword = async (payload: SetPasswordDTO) => {
  const { data } = await axiosInstance.post<SetPasswordDTO, any>(
    `/app/auth/set-password`,
    payload,
  );
  return data;
};

export const forgotPassword = async (payload: ForgotPasswordDTO) => {
  const { data } = await axiosInstance.post<ForgotPasswordDTO, any>(
    `/app/auth/forgot-password`,
    payload,
  );
  return data;
};

export const resendOtp = async (payload: ResendOtpDTO) => {
  const { data } = await axiosInstance.post<ResendOtpDTO, any>(
    `/app/auth/resend-otp`,
    payload,
  );
  return data;
};

// export const logout = async (payload: LogoutDTO) => {
//   const { data } = await axiosInstance.post<LogoutDTO, any>(`/app/auth/logout`);
//   return data;
// };

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
    payload,
  );
  return data;
};

export const changePassword = async (payload: ChangePasswordDTO) => {
  const { data } = await axiosInstance.post<ChangePasswordDTO, any>(
    `/app/auth/change-password`,
    payload,
  );
  return data;
};

export const loginMutationOptions = () => {
  return {
    mutationFn: login,
    mutationKey: ['login'],
    // onSuccess: (data) => {
    //   console.log('Login successful:', data);
    // },
    // onError: (error) => {
    //   console.error('Login failed:', error);
    // },
  } as UseMutationOptions<LoginDTO, unknown, LoginDTO>;
};

export const useLoginMutation = () => {
  // const router = useRouter();

  return useMutation({
    mutationFn: login,
    // mutationFn: async (data: LoginDTO) => {
    //   return login(data);
    // },
    onSuccess: (data) => {
      console.log('Login successful:', data);

      // if (!data?.success && data?.statusCode === 412) {
      //   router.push({
      //     pathname: '/auth/verify-otp',
      //     params: { phone: data?.i},
      //     // params: { phone: getValues('identifier') },
      //   });
      // } else if (!data?.success && data?.statusCode === 419) {
      //   router.push({
      //     pathname: '/auth/set-password',
      //     params: { phone: getValues('identifier') },
      //   });
      // } else if (!data?.success && data?.statusCode === 416) {
      //   router.push({
      //     pathname: '/auth/set-password',
      //     params: { phone: getValues('identifier') },
      //   });
      // } else if (!data?.success) {
      //   // this.toastService.show(data?.message, {
      //   //   classname: 'bg-danger text-white',
      //   //   delay: 15000,
      //   // });
      //   // this.isLoading = false;
      // } else {
      //   router.replace('/(app)/profile');
      // }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({ mutationFn: register });
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
  return useMutation({ mutationFn: verifyOtp });
};

export const useResendOtpMutation = () => {
  return useMutation({
    mutationFn: resendOtp,
  });
};

// export const useLogoutMutation = () => {
//   return useMutation({
//     mutationFn: logout,
//   });
// };

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
