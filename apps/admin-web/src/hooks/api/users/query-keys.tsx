import { PaginationType } from '../base';

// define the query keys here
export const userKeys = {
  getAllUsers: () => ['company-users'] as const,
  specificUsers: (pageOptions?: PaginationType) =>
    [...userKeys.getAllUsers(), pageOptions] as const,
  getUserById: (userId?: number) => ['company-users', userId] as const,
};
