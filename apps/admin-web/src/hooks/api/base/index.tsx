// create a base zod schema type for as abase schema for all schema definitions for listing
import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.number().min(1, 'Page must be at least 1'),
  limit: z.number().min(1, 'Take must be at least 1'),
  sort: z.string().optional(),
  order: z.enum(['ASC', 'DESC']).optional(),
  search: z.string().optional(),
  // filter: z.object({}).optional(),
});

export type PaginationType = z.infer<typeof paginationSchema>;

// data source / list with pagination
export interface DataSource<T> {
  data: T[];
  success: boolean;
  message: string;
  statusCode: number;
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: [string, string][];
  };
  links: {
    first: string;
    previous: string;
    current: string;
    next: string;
    last: string;
  };
}
export { getUrl, getUrlParams } from './url-builder';
