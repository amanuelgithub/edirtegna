import { SORT_ORDER } from './table.type';

export interface IDatasourceParameters {
  page?: number; // requested page index (starts at 1)
  take?: number; // number of rows on the page
  orders?: IDatasourceOrder[];
  filters?: IDatasourceFilter[];
  fullTextFilter?: string;
}

export interface IDatasourceFilter {
  name: string;
  value: unknown;
  operator: FilterOperator;
}
export enum FilterOperator {
  EQ = '$eq',
  GT = '$gt',
  GTE = '$gte',
  IN = '$in',
  NULL = '$null',
  LT = '$lt',
  LTE = '$lte',
  BTW = '$btw',
  ILIKE = '$ilike',
  SW = '$sw',
  CONTAINS = '$contains',
}
export interface IDatasourceOrder {
  name: string;
  dir: SORT_ORDER;
}
