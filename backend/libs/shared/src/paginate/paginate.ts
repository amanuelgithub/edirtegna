import { Logger, ServiceUnavailableException } from '@nestjs/common';
import { mapKeys } from 'lodash';
import { stringify } from 'querystring';
import {
  Brackets,
  FindOperator,
  FindOptionsRelationByString,
  FindOptionsRelations,
  FindOptionsUtils,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { WherePredicateOperator } from 'typeorm/query-builder/WhereClause';
import { OrmUtils } from 'typeorm/util/OrmUtils';
import { PaginateQuery } from './decorator';
import { FilterOperator, FilterSuffix, addFilter } from './filter';
import {
  Column,
  Order,
  RelationColumn,
  SortBy,
  checkIsEmbedded,
  checkIsRelation,
  extractVirtualProperty,
  fixColumnAlias,
  getPropertiesByColumnName,
  getQueryUrlComponents,
  includesAllPrimaryKeyColumns,
  isEntityKey,
  positiveNumberOrDefault,
} from './helper';

const logger: Logger = new Logger('paginate');

export { FilterOperator, FilterSuffix };

export class Paginated<T> {
  success?: boolean = true;
  message?: string = 'Successful';
  statusCode?: number = 200;

  data: T[];
  meta: {
    itemsPerPage: number; // take
    totalItems: number; //itemCount
    currentPage: number; // page
    totalPages: number; //pageCount
    sortBy: SortBy<T>;
    searchBy: Column<T>[];
    search: string;
    select: string[];
    filter?: {
      [column: string]: string | string[];
    };
  };
  links: {
    first?: string;
    previous?: string;
    current: string;
    next?: string;
    last?: string;
  };
}

export enum PaginationType {
  LIMIT_AND_OFFSET = 'limit',
  TAKE_AND_SKIP = 'take',
}

export interface PaginateConfig<T> {
  relations?: FindOptionsRelations<T> | RelationColumn<T>[] | FindOptionsRelationByString;
  sortableColumns: Column<T>[];
  nullSort?: 'first' | 'last';
  searchableColumns?: Column<T>[];
  select?: Column<T>[] | string[];
  groupBy?: Column<T>[] | string[];
  maxLimit?: number;
  defaultSortBy?: SortBy<T>;
  defaultLimit?: number;
  where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  filterableColumns?: {
    [key in Column<T> | string]?: (FilterOperator | FilterSuffix)[] | true;
  };
  calculatedColumns?: ICalculatedColumn;
  loadEagerRelations?: boolean;
  withDeleted?: boolean;
  paginationType?: PaginationType;
  relativePath?: boolean;
  origin?: string;
  ignoreSearchByInQueryParam?: boolean;
  ignoreSelectInQueryParam?: boolean;
}
export interface ICalculatedColumn {
  [key: string]: string;
}

export const DEFAULT_MAX_LIMIT = 100;
export const DEFAULT_LIMIT = 20;
export const NO_PAGINATION = 0;

const generateWhereStatement = <T>(queryBuilder: SelectQueryBuilder<T>, obj: FindOptionsWhere<T> | FindOptionsWhere<T>[]) => {
  const toTransform = Array.isArray(obj) ? obj : [obj];
  return toTransform.map((item) => flattenWhereAndTransform(queryBuilder, item).join(' AND ')).join(' OR ');
};

const flattenWhereAndTransform = <T>(queryBuilder: SelectQueryBuilder<T>, obj: FindOptionsWhere<T>, separator = '.', parentKey = '') => {
  return Object.entries(obj).flatMap(([key, value]) => {
    if (obj.hasOwnProperty(key)) {
      const joinedKey = parentKey ? `${parentKey}${separator}${key}` : key;

      if (typeof value === 'object' && value !== null && !(value instanceof FindOperator)) {
        return flattenWhereAndTransform(queryBuilder, value as FindOptionsWhere<T>, separator, joinedKey);
      } else {
        const property = getPropertiesByColumnName(joinedKey);
        const { isVirtualProperty, query: virtualQuery } = extractVirtualProperty(queryBuilder, property);
        const isRelation = checkIsRelation(queryBuilder, property.propertyPath);
        const isEmbedded = checkIsEmbedded(queryBuilder, property.propertyPath);
        const alias = fixColumnAlias(property, queryBuilder.alias, isRelation, isVirtualProperty, isEmbedded, virtualQuery);
        const whereClause = queryBuilder['createWhereConditionExpression'](queryBuilder['getWherePredicateCondition'](alias, value));

        const allJoinedTables = queryBuilder.expressionMap.joinAttributes.reduce(
          (acc, attr) => {
            acc[attr.alias.name] = true;
            return acc;
          },
          {} as Record<string, boolean>,
        );

        const allTablesInPath = property.column.split('.').slice(0, -1);
        const tablesToJoin = allTablesInPath.map((table, idx) => {
          if (idx === 0) {
            return table;
          }
          return [...allTablesInPath.slice(0, idx), table].join('.');
        });

        tablesToJoin.forEach((table) => {
          const pathSplit = table.split('.');
          const fullPath =
            pathSplit.length === 1
              ? ''
              : `_${pathSplit
                  .slice(0, -1)
                  .map((p) => p + '_rel')
                  .join('_')}`;
          const tableName = pathSplit[pathSplit.length - 1];
          const tableAliasWithProperty = `${queryBuilder.alias}${fullPath}.${tableName}`;
          const joinTableAlias = `${queryBuilder.alias}${fullPath}_${tableName}_rel`;

          const baseTableAlias = allJoinedTables[joinTableAlias];

          if (baseTableAlias) {
            return;
          } else {
            queryBuilder.leftJoin(tableAliasWithProperty, joinTableAlias);
          }
        });

        return whereClause;
      }
    }
  });
};

export const paginate = async <T extends ObjectLiteral>(query: PaginateQuery, repo: Repository<T> | SelectQueryBuilder<T>, config: PaginateConfig<T>): Promise<Paginated<T>> => {
  const page = positiveNumberOrDefault(query.page, 1, 1);
  const virtualCols: { [alias: string]: string } = config.calculatedColumns || null;

  const defaultLimit = config.defaultLimit || DEFAULT_LIMIT;
  const maxLimit = positiveNumberOrDefault(config.maxLimit, DEFAULT_MAX_LIMIT);
  const queryLimit = positiveNumberOrDefault(query.limit, defaultLimit);

  const isPaginated = !(queryLimit === NO_PAGINATION && maxLimit === NO_PAGINATION);

  const limit = isPaginated ? Math.min(queryLimit || defaultLimit, maxLimit || DEFAULT_MAX_LIMIT) : NO_PAGINATION;

  const sortBy = [] as SortBy<T>;
  const searchBy: Column<T>[] = [];

  let [items, totalItems]: [T[], number] = [[], 0];

  const queryBuilder = repo instanceof Repository ? repo.createQueryBuilder('__root') : repo;

  if (repo instanceof Repository && !config.relations && config.loadEagerRelations === true) {
    if (!config.relations) {
      FindOptionsUtils.joinEagerRelations(queryBuilder, queryBuilder.alias, repo.metadata);
    }
  }

  if (isPaginated) {
    // Allow user to choose between limit/offset and take/skip.
    // However, using limit/offset can cause problems when joining one-to-many etc.
    if (config.paginationType === PaginationType.LIMIT_AND_OFFSET) {
      queryBuilder.limit(limit).offset((page - 1) * limit);
    } else {
      queryBuilder.take(limit).skip((page - 1) * limit);
    }
  }

  if (config.relations) {
    const relations = Array.isArray(config.relations) ? OrmUtils.propertyPathsToTruthyObject(config.relations) : config.relations;
    const createQueryBuilderRelations = (prefix: string, relations: FindOptionsRelations<T> | RelationColumn<T>[], alias?: string) => {
      Object.keys(relations).forEach((relationName) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const relationSchema = relations![relationName]!;

        queryBuilder.leftJoinAndSelect(`${alias ?? prefix}.${relationName}`, `${alias ?? prefix}_${relationName}_rel`);

        if (typeof relationSchema === 'object') {
          createQueryBuilderRelations(relationName, relationSchema, `${alias ?? prefix}_${relationName}_rel`);
        }
      });
    };
    createQueryBuilderRelations(queryBuilder.alias, relations);
  }

  // MySQL has an undocumented syntax to sort nulls last.
  // Place a minus sign (-) before the column name and switch the ASC to DESC:

  // Get the database type
  const databaseType = queryBuilder?.connection?.options?.type;

  // Check if the database type is 'mysql' or 'mariadb'
  let nullSort: 'NULLS LAST' | 'NULLS FIRST' | undefined = undefined;
  if (!['mysql', 'mariadb'].includes(databaseType) && config.nullSort) {
    nullSort = config.nullSort === 'last' ? 'NULLS LAST' : 'NULLS FIRST';
  }

  if (config.sortableColumns.length < 1) {
    const message = "Missing required 'sortableColumns' config.";
    logger.debug(message);
    throw new ServiceUnavailableException(message);
  }
  // console.log('queryBuilder.getQueryAndParameters()1', queryBuilder.getQueryAndParameters());

  if (config.groupBy && config.groupBy.length > 0) {
    const _cols = [];
    for (const col of config.groupBy) {
      const columnProperties = getPropertiesByColumnName(col);
      const isRelation = checkIsRelation(queryBuilder, columnProperties.propertyPath);
      _cols.push(fixColumnAlias(columnProperties, queryBuilder.alias, isRelation));
    }
    for (const col of _cols) {
      queryBuilder.addGroupBy(col);
    }
  }
  // console.log('queryBuilder.getQueryAndParameters()2', queryBuilder.getQueryAndParameters());

  if (query.sortBy) {
    for (const order of query.sortBy) {
      if (isEntityKey(config.sortableColumns, order[0]) && ['ASC', 'DESC'].includes(order[1]?.toUpperCase())) {
        sortBy.push(order as Order<T>);
      }
    }
  }

  if (!sortBy.length) {
    sortBy.push(...(config.defaultSortBy || [[config.sortableColumns[0], 'ASC']]));
  }

  for (const order of sortBy) {
    const columnProperties = getPropertiesByColumnName(order[0]);
    const { isVirtualProperty } = extractVirtualProperty(queryBuilder, columnProperties);
    const isRelation = checkIsRelation(queryBuilder, columnProperties.propertyPath);
    const isEmbeded = checkIsEmbedded(queryBuilder, columnProperties.propertyPath);
    let alias = fixColumnAlias(columnProperties, queryBuilder.alias, isRelation, isVirtualProperty, isEmbeded);
    if (isVirtualProperty) {
      alias = `"${alias}"`;
    }
    queryBuilder.addOrderBy(alias, order[1]?.toUpperCase() as 'ASC' | 'DESC', nullSort);
  }

  // When we partial select the columns (main or relation) we must add the primary key column otherwise
  // typeorm will not be able to map the result.
  const selectParams = config.select && query.select && !config.ignoreSelectInQueryParam ? config.select.filter((column) => query.select.includes(column)) : config.select;
  const virtualColKeys = Object.keys(virtualCols || []).map((k) => `${k}`);
  if (selectParams?.length > 0 && includesAllPrimaryKeyColumns(queryBuilder, selectParams)) {
    const cols: string[] = selectParams
      .reduce((cols, currentCol) => {
        const columnProperties = getPropertiesByColumnName(currentCol);
        const isRelation = checkIsRelation(queryBuilder, columnProperties.propertyPath);
        cols.push(fixColumnAlias(columnProperties, queryBuilder.alias, isRelation));
        return cols;
      }, [])
      ?.filter((c: string) => {
        const _colNameParts = c?.split('.');
        const _colNameOnly = _colNameParts.pop();
        return !virtualColKeys.includes(_colNameOnly);
      });
    queryBuilder.select(cols);
  }
  if (virtualCols) {
    Object.keys(virtualCols).forEach((key) => {
      queryBuilder.addSelect(`${virtualCols[key]}`, key);
    });
  }

  if (config.where && repo instanceof Repository) {
    const baseWhereStr = generateWhereStatement(queryBuilder, config.where);
    queryBuilder.andWhere(`(${baseWhereStr})`);
  }

  if (config.withDeleted) {
    queryBuilder.withDeleted();
  }

  if (config.searchableColumns) {
    if (query.searchBy && !config.ignoreSearchByInQueryParam) {
      for (const column of query.searchBy) {
        if (isEntityKey(config.searchableColumns, column)) {
          searchBy.push(column);
        }
      }
    } else {
      searchBy.push(...config.searchableColumns);
    }
  }

  if (query.search && searchBy.length) {
    queryBuilder.andWhere(
      new Brackets((qb: SelectQueryBuilder<T>) => {
        for (const column of searchBy) {
          const property = getPropertiesByColumnName(column);
          const { isVirtualProperty, query: virtualQuery } = extractVirtualProperty(qb, property);
          const isRelation = checkIsRelation(qb, property.propertyPath);
          const isEmbeded = checkIsEmbedded(qb, property.propertyPath);
          const alias = fixColumnAlias(property, qb.alias, isRelation, isVirtualProperty, isEmbeded, virtualQuery);

          const condition: WherePredicateOperator = {
            operator: 'ilike',
            parameters: [alias, `:${property.column}`],
          };

          if (['postgres', 'cockroachdb'].includes(queryBuilder.connection.options.type)) {
            condition.parameters[0] = `CAST(${condition.parameters[0]} AS text)`;
          }

          qb.orWhere(qb['createWhereConditionExpression'](condition), {
            [property.column]: `%${query.search}%`,
          });
        }
      }),
    );
  }

  if (query.filter) {
    addFilter(queryBuilder, query, config.filterableColumns);
  }

  if (isPaginated) {
    [items, totalItems] = await queryBuilder.getManyAndCount();
  } else {
    items = await queryBuilder.getMany();
  }

  let path: string;
  const { queryOrigin, queryPath } = getQueryUrlComponents(query.path);
  if (config.relativePath) {
    path = queryPath;
  } else if (config.origin) {
    path = config.origin + queryPath;
  } else {
    path = queryOrigin + queryPath;
  }

  const sortByQuery = sortBy.map((order) => `&sortBy=${order.join(':')}`).join('');
  const searchQuery = query.search ? `&search=${query.search}` : '';

  const searchByQuery = query.searchBy && searchBy.length && !config.ignoreSearchByInQueryParam ? searchBy.map((column) => `&searchBy=${column}`).join('') : '';

  // Only expose select in meta data if query select differs from config select
  const isQuerySelected = selectParams?.length !== config.select?.length;
  const selectQuery = isQuerySelected ? `&select=${selectParams.join(',')}` : '';

  const filterQuery = query.filter
    ? '&' +
      stringify(
        mapKeys(query.filter, (_param, name) => 'filter.' + name),
        '&',
        '=',
        { encodeURIComponent: (str) => str },
      )
    : '';

  const options = `&limit=${limit}${sortByQuery}${searchQuery}${searchByQuery}${selectQuery}${filterQuery}`;

  const buildLink = (p: number): string => path + '?page=' + p + options;

  const totalPages = isPaginated ? Math.ceil(totalItems / limit) : 1;

  const results: Paginated<T> = {
    data: items,
    meta: {
      itemsPerPage: isPaginated ? limit : items.length,
      totalItems: isPaginated ? totalItems : items.length,
      currentPage: page,
      totalPages,
      sortBy,
      search: query.search,
      searchBy: query.search ? searchBy : undefined,
      select: isQuerySelected ? selectParams : undefined,
      filter: query.filter,
    },
    links: {
      first: page == 1 ? undefined : buildLink(1),
      previous: page - 1 < 1 ? undefined : buildLink(page - 1),
      current: buildLink(page),
      next: page + 1 > totalPages ? undefined : buildLink(page + 1),
      last: page == totalPages || !totalItems ? undefined : buildLink(totalPages),
    },
  };

  return Object.assign(new Paginated<T>(), results);
};
