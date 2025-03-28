import { PaginateConfig } from './paginate';
import { SelectOneConfig } from './selecOne';

type Config<T> = PaginateConfig<T> | SelectOneConfig<T>;

export function copyConfig<T>(config: Config<T>): Config<T> {
  if ('sortableColumns' in config) {
    // config is PaginateConfig
    return {
      where: config.where,
      relations: config.relations,
      select: config.select,
      filterableColumns: config.filterableColumns,
      calculatedColumns: config.calculatedColumns,
      loadEagerRelations: config.loadEagerRelations,
      withDeleted: config.withDeleted,
      ignoreSearchByInQueryParam: config.ignoreSearchByInQueryParam,
      ignoreSelectInQueryParam: config.ignoreSelectInQueryParam,
    } as SelectOneConfig<T>;
  } else {
    // config is SelectOneConfig
    return {
      relations: config.relations,
      sortableColumns: [],
      searchableColumns: [],
      select: config.select,
      maxLimit: undefined,
      defaultSortBy: undefined,
      defaultLimit: undefined,
      where: config.where,
      filterableColumns: config.filterableColumns,
      calculatedColumns: config.calculatedColumns,
      loadEagerRelations: config.loadEagerRelations,
      withDeleted: config.withDeleted,
      paginationType: undefined,
      relativePath: undefined,
      origin: undefined,
      ignoreSearchByInQueryParam: config.ignoreSearchByInQueryParam,
      ignoreSelectInQueryParam: config.ignoreSelectInQueryParam,
    } as PaginateConfig<T>;
  }
}
