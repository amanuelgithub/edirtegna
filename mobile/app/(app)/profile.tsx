import { View, Text, Button } from 'react-native';
import {
  authQueryKeys,
  createGetProfileQueryOptions,
  useSetPasswordMutation,
} from '@/hooks/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export default function ProfileScreen() {
  const queryClient = useQueryClient();
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: authQueryKeys.getProfile });
    }, 3000);
  }, []);

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
    </View>
  );
}
