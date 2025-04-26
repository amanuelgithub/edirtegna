import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  useEffect,
} from 'react';
import { useRouter } from 'expo-router'; // Import useRouter from Expo Router
import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/config/env';
import axiosInstance from '@/config/request';

// export const axiosInstance: AxiosInstance = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });

interface AuthContextType {
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  getRefreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return authContext;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const loadTokens = async () => {
      const storedAccessToken = await SecureStore.getItemAsync('accessToken');
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      if (storedAccessToken && storedRefreshToken) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setIsAuthenticated(true);
        router.replace('/(protected)/(tabs)'); // Redirect to home page if authenticated
      } else {
        router.replace('/auth/signin'); // Redirect to sign-in page if not authenticated
        // router.replace('/auth/sign-in'); // Redirect to sign-in page if not authenticated
      }
    };
    loadTokens();
  }, []);

  const login = async (accessToken: string, refreshToken: string) => {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setIsAuthenticated(true);
    router.replace('/(protected)/(tabs)'); // Redirect to home page after login
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    router.replace('/auth/signin'); // Redirect to sign-in page after logout
  };

  const getAccessToken = async (): Promise<string | null> => {
    return await SecureStore.getItemAsync('accessToken');
  };

  const getRefreshToken = async (): Promise<string | null> => {
    return await AsyncStorage.getItem('refreshToken');
  };

  useLayoutEffect(() => {
    const authInterceptor = axiosInstance.interceptors.request.use(
      async (config: any) => {
        const token = await getAccessToken();
        config.headers.Authorization =
          !config._retry && token
            ? `Bearer ${token}`
            : config.headers.Authorization;
        return config;
      },
    );

    return () => {
      axiosInstance.interceptors.request.eject(authInterceptor);
    };
  }, []);

  useLayoutEffect(() => {
    const refreshInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          try {
            const storedRefreshToken = await getRefreshToken();
            if (!storedRefreshToken)
              throw new Error('No refresh token available');

            const response = await axiosInstance.post('/app/auth/refresh', {
              refreshToken: storedRefreshToken,
            });

            await login(response.data.accessToken, response.data.refreshToken);

            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            originalRequest._retry = true;

            return axiosInstance(originalRequest);
          } catch (error) {
            await logout();
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosInstance.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        getAccessToken,
        getRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
