import { IDatasourceParameters } from '@/core/models';
import { PaginationType } from '../base';

// define the query keys here
export const userKeys = {
  getAllUsers: () => ['company-users'] as const,
  specificUsers: (options: IDatasourceParameters) =>
    [...userKeys.getAllUsers(), options] as const,
  getUserById: (userId?: number) => ['company-users', userId] as const,
};
