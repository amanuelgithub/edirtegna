import axios, { AxiosInstance } from 'axios';
import { BASE_URL } from '../core/constants';

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL, // change to your API base URL
  withCredentials: true,
});
