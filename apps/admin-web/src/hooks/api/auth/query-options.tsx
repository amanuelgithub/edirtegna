import axiosInstance from '@/config/request';
import { queryOptions } from '@tanstack/react-query';
import { getProfile } from './api';

// define the query keys here
export const authQueryKeys = {
  getProfile: ['profile'] as const,
};

// list of query keys
export function createGetProfileQueryOptions() {
  return queryOptions({
    queryKey: authQueryKeys.getProfile,
    queryFn: getProfile,
  });
}
