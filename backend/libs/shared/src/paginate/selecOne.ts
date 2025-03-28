import {
  Brackets,
  EntityManager,
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
import { SelectOneQuery } from './decorator';
import { FilterOperator, FilterSuffix, addFilter } from './filter';
import {
  Column,
  RelationColumn,
  checkIsEmbedded,
  checkIsRelation,
  extractVirtualProperty,
  fixColumnAlias,
  getPropertiesByColumnName,
  includesAllPrimaryKeyColumns,
} from './helper';
import { ICalculatedColumn } from './paginate';

export { FilterOperator, FilterSuffix };

export interface SelectOneOpts<T> {
  where: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  m?: EntityManager;
  query?: SelectOneQuery;
  setPessimisticLock?: boolean;
}
export interface SelectOneConfig<T> {
  relations?: FindOptionsRelations<T> | RelationColumn<T>[] | FindOptionsRelationByString;
  groupBy?: Column<T>[] | string[];
  select?: Column<T>[] | string[];
  where: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  filterableColumns?: {
    [key in Column<T> | string]?: (FilterOperator | FilterSuffix)[] | true;
  };
  calculatedColumns?: ICalculatedColumn;
  loadEagerRelations?: boolean;
  withDeleted?: boolean;
  ignoreSearchByInQueryParam?: boolean;
  ignoreSelectInQueryParam?: boolean;
}

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

export const selectOne = async <T extends ObjectLiteral>(
  query: SelectOneQuery | null, // query presented by user
  repo: Repository<T> | SelectQueryBuilder<T>,
  config: SelectOneConfig<T>, // actual entity configuration
  setPessimisticLock = false,
): Promise<T> => {
  const virtualCols: { [alias: string]: string } = config.calculatedColumns || null;

  const searchBy: Column<T>[] = [];

  let [item]: [T] = [null];

  const queryBuilder = repo instanceof Repository ? repo.createQueryBuilder('__root') : repo;
  if (setPessimisticLock) {
    queryBuilder.setLock('pessimistic_write');
  }

  if (repo instanceof Repository && !config.relations && config.loadEagerRelations === true) {
    if (!config.relations) {
      FindOptionsUtils.joinEagerRelations(queryBuilder, queryBuilder.alias, repo.metadata);
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

  // When we partial select the columns (main or relation) we must add the primary key column otherwise
  // typeorm will not be able to map the result.
  const selectParams = config?.select && query?.select && !config.ignoreSelectInQueryParam ? config?.select?.filter((column) => query.select.includes(column)) : config?.select;
  const virtualColKeys = Object.keys(virtualCols || []).map((k) => `${k}`);
  if (selectParams && selectParams?.length > 0 && includesAllPrimaryKeyColumns(queryBuilder, selectParams)) {
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
  if (config.where) {
    const baseWhereStr = generateWhereStatement(queryBuilder, config.where);

    queryBuilder.andWhere(`(${baseWhereStr})`);
  }
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
  if (config.withDeleted) {
    queryBuilder.withDeleted();
  }

  if (query && query.search && searchBy.length) {
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
            [property.column]: `%${query?.search}%`,
          });
        }
      }),
    );
  }

  if (query?.filter) {
    addFilter(queryBuilder, query, config.filterableColumns);
  }

  item = await queryBuilder.getOne();
  return item;
};
