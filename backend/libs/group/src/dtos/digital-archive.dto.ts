import { DigitalArchiveEntity } from '@app/db/group';
import { FilterOperator, PaginateConfig, SelectOneConfig, copyConfig } from '@app/shared';

export class CreateDigitalArchiveDto {}

export class UpdateDigitalArchiveDto extends CreateDigitalArchiveDto {}

export const DigitalArchivePageConfigDto: PaginateConfig<DigitalArchiveEntity> = {
  sortableColumns: ['title', 'description', 'fileUrl', 'uploadDate'],
  searchableColumns: ['title', 'description'],
  defaultSortBy: [['uploadDate', 'DESC']],
  select: ['title', 'description', 'fileUrl', 'uploadDate', 'group.id', 'group.name', 'uploadedBy.id', 'uploadedBy.firstName', 'uploadedBy.lastName'],
  filterableColumns: {
    title: [FilterOperator.ILIKE],
    description: [FilterOperator.ILIKE],
    fileUrl: [FilterOperator.ILIKE],
    uploadDate: [FilterOperator.GT, FilterOperator.LT],
    groupId: [FilterOperator.EQ],
    uploadedById: [FilterOperator.EQ],
  },
};

export const DigitalArchiveSelectOneConfigDto = copyConfig(DigitalArchivePageConfigDto) as SelectOneConfig<DigitalArchiveEntity>;
