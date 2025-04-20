import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useLayoutEffect,
} from 'react';

import { axiosInstance } from '@/config';
import { User } from '@/core/models';

interface AuthContextProps {
  accessToken: string;
  setAccessToken: (token: string) => void;
  user?: User;
  setUserProfile: (user: User) => void;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string>('');
  const [user, setUser] = useState<User | undefined>();

  useLayoutEffect(() => {
    // console.log('useLayoutEffect');
    const authInterceptor = axiosInstance.interceptors.request.use(
      (config: any) => {
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
  }, [token]);

  useLayoutEffect(() => {
    // console.log('useLayoutEffect');
    const refreshInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          // error.response?.status === 401
          // && originalRequest
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry &&
          originalRequest.url &&
          !originalRequest.url.endsWith('login') &&
          !originalRequest.url.endsWith('refresh')
        ) {
          // if (error.response?.status === 401 && !originalRequest._retry) {
          try {
            const response = await axiosInstance.post(
              '/web/auth/refresh',
              {},
              { withCredentials: true },
            );

            login(response.data.accessToken);

            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            originalRequest._retry = true;

            return axiosInstance(originalRequest);
          } catch {
            setToken('');
            setUserProfile();
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosInstance.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  const setAccessToken = (token: string) => {
    setToken(token);
  };

  const setUserProfile = (user?: User) => {
    setUser(user);
  };

  const login = (user: User) => {
    setUser(user);
  };

  const logout = () => {
    setAccessToken('');
    setUserProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken: token,
        setAccessToken,
        user,
        setUserProfile,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
