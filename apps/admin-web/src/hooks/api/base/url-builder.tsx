import {
  FilterOperator,
  IDatasourceParameters,
  SORT_ORDER,
} from '@/core/models';

const TAKE = 10;

export function getUrl(apiUrl: string, request?: IDatasourceParameters) {
  let url = `${apiUrl}`;
  url += `?page=${request?.page}&limit=${request?.take || TAKE}&`;
  if (request?.orders && request?.orders?.length > 0)
    url += `sortBy=${request?.orders
      .map((o) => `${o.name}:${o.dir}`)
      .join(',')}&`;
  request?.filters?.forEach((filter) => {
    if (filter.value)
      url += `filter.${filter.name}=${filter.operator}:${filter.value}&`;
  });
  if (request?.fullTextFilter) url += `search=${request?.fullTextFilter}&`;
  if (url && url.endsWith(`&`)) url = url.slice(0, -1);
  return url;
}

export function getUrlParams(request?: IDatasourceParameters) {
  console.log('filters => ', request?.filters);
  const params = new URLSearchParams({
    page: String(request?.page),
    limit: String(request?.take || TAKE),
    sortBy:
      request?.orders && request?.orders?.length > 0
        ? `${request?.orders.map((o) => `${o.name}:${o.dir}`).join(',')}`
        : 'id:DESC',
    search: request?.fullTextFilter ?? '',
    filters:
      request?.filters && request?.filters?.length > 0
        ? request?.filters
            .map((filter) => {
              let filterValue = '';
              if (filter.value) {
                filterValue = `filter.${filter.name}=${filter.operator}:${filter.value}&`;
              }
              return filterValue;
            })
            .join('')
        : '',
  });

  return params;
}

export function parseUrlParams(queryString: string): IDatasourceParameters {
  const params = new URLSearchParams(queryString);

  // Parse page
  const pageStr = params.get('page');
  const page = pageStr ? Number(pageStr) : undefined;

  // Parse limit as take
  const limitStr = params.get('limit');
  const take = limitStr ? Number(limitStr) : undefined;

  // Parse sortBy into orders
  const sortByStr = params.get('sortBy') || '';
  const sortByParts = sortByStr.split(',').filter((part) => part !== '');
  const orders = sortByParts.map((part) => {
    const colonIndex = part.indexOf(':');
    const name = part.substring(0, colonIndex);
    const dir = part.substring(colonIndex + 1) as SORT_ORDER;
    return { name, dir };
  });

  // Parse search as fullTextFilter
  const search = params.get('search') ?? '';

  // Parse filters
  const filtersStr = params.get('filters') || '';
  const filterParts = filtersStr.split('&').filter((part) => part !== '');
  const filters = filterParts.map((part) => {
    const [left, right] = part.split('=');
    const name = left.split('.')[1];
    const operatorEnd = right.indexOf(':');
    const operatorStr = right.substring(0, operatorEnd);
    const value = right.substring(operatorEnd + 1);
    const operator = operatorStr as FilterOperator;
    return { name, value, operator };
  });

  return {
    page,
    take,
    orders: orders.length > 0 ? orders : undefined,
    filters: filters.length > 0 ? filters : undefined,
    fullTextFilter: search,
  };
}
