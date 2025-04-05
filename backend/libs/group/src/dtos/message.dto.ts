import { MessageEntity } from '@app/db/group';
import { FilterOperator, PaginateConfig, SelectOneConfig, copyConfig } from '@app/shared';

export class CreateMessageDto {}

export class UpdateMessageDto extends CreateMessageDto {}

export const MessagePageConfigDto: PaginateConfig<MessageEntity> = {
  sortableColumns: [],
  searchableColumns: ['id'],
  defaultSortBy: [['createdAt', 'DESC']],
  select: ['id', 'createdAt', 'updatedAt'],
  filterableColumns: {},
};

export const MessageSelectOneConfigDto = copyConfig(MessagePageConfigDto) as SelectOneConfig<MessageEntity>;
