import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { GroupPageConfigDto, CreateGroupDto, UpdateGroupDto } from '../dtos/group.dto';
import { GroupEntity } from '@app/db/group';
import { DetailResponse, PaginateQuery, paginate } from '@app/shared';

@Injectable()
export class GroupService {
  constructor(private readonly ds: DataSource) {}

  async getAll(query: PaginateQuery, where?: FindOptionsWhere<GroupEntity> | FindOptionsWhere<GroupEntity>[]) {
    return paginate(query, this.ds.getRepository(GroupEntity), { ...GroupPageConfigDto, where });
  }

  async findOne(id: number) {
    const data = await this.ds.getRepository(GroupEntity).findOne({ where: { id } });
    if (!data) throw new NotFoundException(`Requested record not found`);
    return new DetailResponse(data.toDto());
  }

  async create(body: CreateGroupDto) {
    const data = this.ds.getRepository(GroupEntity).create({ ...body });
    await this.ds.getRepository(GroupEntity).save(data);
    return new DetailResponse(data);
  }

  async update(id: number, body: UpdateGroupDto) {
    const data = await this.ds.getRepository(GroupEntity).preload({ id, ...body });
    if (!data) {
      throw new NotFoundException(`Group with id ${id} not found`);
    }
    await this.ds.getRepository(GroupEntity).save(data);
    return new DetailResponse(data);
  }
}
