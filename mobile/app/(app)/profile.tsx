import { View, Text, Button } from 'react-native';
import {
  authQueryKeys,
  createGetProfileQueryOptions,
  createLogoutMutationOptions,
  useSetPasswordMutation,
} from '@/hooks/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthNewContext';
import { refreshTokenSchema } from '@/hooks/api/auth/types';

export default function ProfileScreen() {
  const queryClient = useQueryClient();
  const { logout, getRefreshToken } = useAuth();
  const { mutate: logoutMutate } = useMutation({
    ...createLogoutMutationOptions(),
    onSuccess: () => {
      // call the logout method from the auth context
      logout();
    },
  });
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
    // refetch: refetchProfile,
  } = useQuery({
    ...createGetProfileQueryOptions(),
    enabled: true,
    refetchOnWindowFocus: true, // Refetches data when window gains focus
    refetchOnReconnect: true, // Refetches data upon reconnecting to the internet
  });

  return (
    <View>
      <Text>ProfileScreen</Text>
      {isProfileLoading && <Text>Loading...</Text>}
      {isProfileError && <Text>Error: {profileError.message}</Text>}
      <Text>Profile Data:</Text>
      <Text>{JSON.stringify(profileData, null, 2)}</Text>

      {/* button to refetch profile */}
      <Button
        title="Refetch Profile"
        onPress={() => {
          queryClient.invalidateQueries({ queryKey: authQueryKeys.getProfile });
        }}
      />

      {/* button to logout */}
      <Button
        title="Logout"
        onPress={async () => {
          logoutMutate({
            // get the refresh token from the storage
            refreshToken: await getRefreshToken(),
          });
        }}
      />
    </View>
  );
}
