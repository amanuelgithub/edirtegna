// import axios, { AxiosInstance } from 'axios';

// // import { API_URL } from '@/config/env';
// const API_URL = 'http://localhost:4000/api';
// const axiosInstance: AxiosInstance = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//     // channel: 'APP',
//     // realm: '',
//   },
//   withCredentials: true,
// });

// // // Add interceptors for request and response
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Add any custom logic before sending the request
//     // print the request URL and method
//     console.log(`Request: ${config.method?.toUpperCase()} ${config.url}`);
//     return config;
//   },
//   (error) => {
//     // Handle request error
//     return Promise.reject(error);
//   }
// );
// // axiosInstance.interceptors.response.use(
// //   (response) => {
// //     // Handle successful response
// //     return response;
// //   },
// //   (error) => {
// //     // Handle response error
// //     return Promise.reject(error);
// //   }
// // );

// // export { axiosInstance };
// export default axiosInstance;

// ************************************** //

// ************************************** //

import axios from 'axios';
import Constants from 'expo-constants';

// Determine the host IP from the Expo debugger host value
// const host = (Constants as any).expoConfig?.debuggerHost?.split(':')?.[0];
// const host = Constants.expoGoConfig?.debuggerHost?.split(':')?.[0];
const host = Constants.expoGoConfig?.debuggerHost?.split(':')?.[0];
console.log('expoGoConfig', Constants);
// console.log('debuggerHost', host);

// Define your API URL from an environment variable or fallback to localhost
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Check if the host IP is a local network IP and if the API_URL uses localhost or 127.0.0.1.
// If both conditions are met, replace localhost with the actual IP.
const baseURL = host
  ? (host.startsWith('192.168') ||
      host.startsWith('10.') ||
      host.startsWith('172.')) &&
    (API_URL.includes('localhost') || API_URL.includes('127.0.0.1'))
    ? API_URL.replace(/(localhost|127\.0\.0\.1)/, host)
    : API_URL
  : '192.168.223.64:3000';

// Create the Axios instance with the computed base URL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  // baseURL: `${baseURL}/api/v1`, // Ensure the base URL ends with /api/v1
  // baseURL: '192.168.223.64:3000/api/v1',
  // // Additional Axios configuration can go here
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Optional: Set up request interceptors if needed
axiosInstance.interceptors.request.use(
  (config) => {
    // For example, add authentication headers here
    console.log(`config.baseURL`, config.baseURL);
    console.log(`config.url`, config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
