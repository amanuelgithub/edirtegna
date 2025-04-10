import { EnumValues } from './enum-type';

export const API_METHOD_TYPE = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
} as const;
export type ApiMethodType = EnumValues<typeof API_METHOD_TYPE>;
