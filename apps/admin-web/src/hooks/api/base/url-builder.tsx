import { IDatasourceParameters } from '@/core/models';

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
