import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_URL } from '@/config/env';
const navigation = require('@react-navigation/native').NavigationContainerRef;
import { router } from 'expo-router';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    origin: 'tms-txn-customer-app',
    channel: 'APP',
    realm: 'CUSTOMER',
  },
  withCredentials: true,
});

// Flags and queue to manage multiple 401 errors while refreshing
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// // Add interceptors for request and response
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  },
);

// Response interceptor: Checks for 401 errors and handles token refresh.
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If we receive a 401 and haven't already retried...
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // If a token refresh is already in progress, queue this request.
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      // Mark request as retry and begin refreshing.
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Get the refresh token from secure storage.
        const refreshToken = await SecureStore.getItemAsync('refreshToken');

        // Call the refresh endpoint.
        const { data } = await axios.post(
          `${API_URL}/app/auth/refresh`, // Use the API_URL constant
          {
            refreshToken,
          },
        );

        const { accessToken, refreshToken: newRefreshToken } = data;

        // Update tokens in secure storage (and AsyncStorage if needed).
        await SecureStore.setItemAsync('accessToken', accessToken);
        await SecureStore.setItemAsync('refreshToken', newRefreshToken);
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', newRefreshToken);

        // Update default headers for future requests.
        axiosInstance.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        // Retry the original request with the new token.
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Redirect the user to the sign-in page when the request fails.
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        // Assuming you are using React Navigation
        router.replace('/auth/signin');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// export { axiosInstance };
export default axiosInstance;
