import { EmergencyRequestEntity } from '@app/db/group';
import { FilterOperator, PaginateConfig, SelectOneConfig, copyConfig } from '@app/shared';

export class CreateEmergencyRequestDto {}

export class UpdateEmergencyRequestDto extends CreateEmergencyRequestDto {}

export const EmergencyRequestPageConfigDto: PaginateConfig<EmergencyRequestEntity> = {
  sortableColumns: [],
  searchableColumns: ['id'],
  defaultSortBy: [['createdAt', 'DESC']],
  select: ['id', 'createdAt', 'updatedAt'],
  filterableColumns: {
    // Add any filterable columns here if needed
  },
};

export const EmergencyRequestSelectOneConfigDto = copyConfig(EmergencyRequestPageConfigDto) as SelectOneConfig<EmergencyRequestEntity>;
