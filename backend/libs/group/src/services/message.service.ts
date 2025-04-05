import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { MessagePageConfigDto, CreateMessageDto, UpdateMessageDto } from '../dtos/message.dto';
import { MessageEntity } from '@app/db/group';
import { DetailResponse, PaginateQuery, paginate } from '@app/shared';

@Injectable()
export class MessageService {
  constructor(private readonly ds: DataSource) {}

  async getAll(query: PaginateQuery, where?: FindOptionsWhere<MessageEntity> | FindOptionsWhere<MessageEntity>[]) {
    return paginate(query, this.ds.getRepository(MessageEntity), { ...MessagePageConfigDto, where });
  }

  async findOne(id: number) {
    const data = await this.ds.getRepository(MessageEntity).findOne({ where: { id } });
    if (!data) throw new NotFoundException(`Requested record not found`);
    return new DetailResponse(data.toDto());
  }

  async create(body: CreateMessageDto) {
    const data = this.ds.getRepository(MessageEntity).create({ ...body });
    await this.ds.getRepository(MessageEntity).save(data);
    return new DetailResponse(data);
  }

  async update(id: number, body: UpdateMessageDto) {
    const data = await this.ds.getRepository(MessageEntity).preload({ id, ...body });
    if (!data) {
      throw new NotFoundException(`Message with id ${id} not found`);
    }
    await this.ds.getRepository(MessageEntity).save(data);
    return new DetailResponse(data);
  }
}
