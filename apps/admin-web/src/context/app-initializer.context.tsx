import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { axiosInstance } from '../services';
import { useAuth } from './auth.context';
// import { getProfileQueryOptions } from '../services/query-options';
import { createGetProfileQueryOptions } from '@/hooks/api';
import { axiosInstance } from '@/config';

// Define context type
interface AppInitContextType {
  isInitialized: boolean; // New flag to track full initialization
  loading: boolean;
  error?: string;
}

const AppInitContext = createContext<AppInitContextType>({
  isInitialized: false,
  loading: true,
});

// Custom Hook to use the context
export const useAppInit = () => useContext(AppInitContext);

// Provider component
export const AppInitializerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const queryClient = useQueryClient();
  const {
    setUserProfile: setProfile,
    accessToken: token,
    setAccessToken,
  } = useAuth();

  // State to track when initialization is complete
  const [isInitialized, setIsInitialized] = useState(false);

  // Token refresh mutation
  const mutation = useMutation({
    mutationFn: () =>
      axiosInstance.post('/web/auth/refresh', {}, { withCredentials: true }),
    onSuccess: (data: any) => {
      setAccessToken(data?.data?.accessToken);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      console.error('Error refreshing the page:', error);
      // setIsInitialized(true); // Mark as initialized even on error to avoid hanging
      setTimeout(() => {
        setIsInitialized(true); // Initialization is complete
      }, 300);
    },
  });

  // Profile fetch query
  const { data: userProfileData, isSuccess: isProfileSuccess } = useQuery({
    // ...getProfileQueryOptions(),
    ...createGetProfileQueryOptions(),
    enabled: !!token,
  });

  // Trigger token refresh on mount
  useLayoutEffect(() => {
    mutation.mutate();
  }, []);

  // Set profile and mark initialization complete when profile is fetched
  useLayoutEffect(() => {
    if (isProfileSuccess) {
      console.log('Profile:', userProfileData?.data);
      setProfile(userProfileData?.data);
      setTimeout(() => {
        setIsInitialized(true); // Initialization is complete
      }, 300);
    }
  }, [isProfileSuccess, setProfile, userProfileData]);

  return (
    <AppInitContext.Provider
      value={{
        isInitialized,
        loading: mutation.isPending || !isProfileSuccess, // Loading until both are done
        error: mutation.error?.message, // Convert error to string if needed
      }}
    >
      {children}
    </AppInitContext.Provider>
  );
};
