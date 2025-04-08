import axios, { AxiosInstance } from 'axios';
import { BASE_URL } from '../core/constants';

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL, // change to your API base URL
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    origin: 'tms-manager-web',
    // this things basically didn't work
    // it is the getting the real from the origin in the backend
    channel: 'WEB',
    realm: 'ADMIN',
  },
});
