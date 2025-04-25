import axiosInstance from '@/config/request';
import { QueryOptions, useQuery } from '@tanstack/react-query';

const usersKeys = {
  getProfile: (userId: string) => ['profile', userId],
};

// export const useGetProfile = () => {
//   const queryClient = useQueryClient();
//   const { userId } = useAuthStore();
//   const { data: profile } = useQuery(
//     usersKeys.getProfile(userId),
//     () => getProfile(userId),
//     {
//       enabled: !!userId,
//       onSuccess: (data) => {
//         queryClient.setQueryData(usersKeys.getProfile(userId), data);
//       },
//     },
//   );

//   return { profile };
// };

export const useGetProfile = () => {
  return useQuery({
    queryKey: [...usersKeys.getProfile('userId')],
    queryFn: async () => {
      const { data } = await axiosInstance.get<any, any>('/app/auth/profile');
      return data?.data;
    },
    // ...options,
  });
};
