import { IDatasourceParameters } from '@/core/models';

const TAKE = 10;

export function getUrl(apiUrl: string, request?: IDatasourceParameters) {
  let url = `${apiUrl}`;
  // const page = (request && request?.page && (request?.page > 0 ? request?.page / (request?.take || this.TAKE) + 1 : request?.page + 1)) || this.PAGE;
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
