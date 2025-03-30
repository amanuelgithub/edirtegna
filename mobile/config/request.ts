import axios, { AxiosInstance } from 'axios';

import { API_URL } from '@/config/env';

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

// // Add interceptors for request and response
axiosInstance.interceptors.request.use(
  (config) => {
    // Add any custom logic before sending the request
    // print the request URL and method
    console.log(`Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);
// axiosInstance.interceptors.response.use(
//   (response) => {
//     // Handle successful response
//     return response;
//   },
//   (error) => {
//     // Handle response error
//     return Promise.reject(error);
//   }
// );

// export { axiosInstance };
export default axiosInstance;
