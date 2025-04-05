import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { GroupMembershipPageConfigDto, CreateGroupMembershipDto, UpdateGroupMembershipDto } from '../dtos/group-membership.dto';
import { GroupMembershipEntity } from '@app/db/group';
import { DetailResponse, PaginateQuery, paginate } from '@app/shared';

@Injectable()
export class GroupMembershipService {
  constructor(private readonly ds: DataSource) {}

  async getAll(query: PaginateQuery, where?: FindOptionsWhere<GroupMembershipEntity> | FindOptionsWhere<GroupMembershipEntity>[]) {
    return paginate(query, this.ds.getRepository(GroupMembershipEntity), { ...GroupMembershipPageConfigDto, where });
  }

  async findOne(id: number) {
    const data = await this.ds.getRepository(GroupMembershipEntity).findOne({ where: { id } });
    if (!data) throw new NotFoundException(`Requested record not found`);
    return new DetailResponse(data.toDto());
  }

  async create(body: CreateGroupMembershipDto) {
    const data = this.ds.getRepository(GroupMembershipEntity).create({ ...body });
    await this.ds.getRepository(GroupMembershipEntity).save(data);
    return new DetailResponse(data);
  }

  async update(id: number, body: UpdateGroupMembershipDto) {
    const data = await this.ds.getRepository(GroupMembershipEntity).preload({ id, ...body });
    if (!data) {
      throw new NotFoundException(`GroupMembership with id ${id} not found`);
    }
    await this.ds.getRepository(GroupMembershipEntity).save(data);
    return new DetailResponse(data);
  }
}
