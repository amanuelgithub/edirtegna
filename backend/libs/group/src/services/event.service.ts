import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { EventPageConfigDto, CreateEventDto, UpdateEventDto } from '../dtos/event.dto';
import { EventEntity } from '@app/db/group';
import { DetailResponse, PaginateQuery, paginate } from '@app/shared';

@Injectable()
export class EventService {
  constructor(private readonly ds: DataSource) {}

  async getAll(query: PaginateQuery, where?: FindOptionsWhere<EventEntity> | FindOptionsWhere<EventEntity>[]) {
    return paginate(query, this.ds.getRepository(EventEntity), { ...EventPageConfigDto, where });
  }

  async findOne(id: number) {
    const data = await this.ds.getRepository(EventEntity).findOne({ where: { id } });
    if (!data) throw new NotFoundException(`Requested record not found`);
    return new DetailResponse(data.toDto());
  }

  async create(body: CreateEventDto) {
    const data = this.ds.getRepository(EventEntity).create({ ...body });
    await this.ds.getRepository(EventEntity).save(data);
    return new DetailResponse(data);
  }

  async update(id: number, body: UpdateEventDto) {
    const data = await this.ds.getRepository(EventEntity).preload({ id, ...body });
    if (!data) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    await this.ds.getRepository(EventEntity).save(data);
    return new DetailResponse(data);
  }
}
