import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { MemberRelativePageConfigDto, CreateMemberRelativeDto, UpdateMemberRelativeDto } from '../dtos/member-relative.dto';
import { MemberRelativeEntity } from '@app/db/group';
import { DetailResponse, PaginateQuery, paginate } from '@app/shared';

@Injectable()
export class MemberRelativeService {
  constructor(private readonly ds: DataSource) {}

  async getAll(query: PaginateQuery, where?: FindOptionsWhere<MemberRelativeEntity> | FindOptionsWhere<MemberRelativeEntity>[]) {
    return paginate(query, this.ds.getRepository(MemberRelativeEntity), { ...MemberRelativePageConfigDto, where });
  }

  async findOne(id: number) {
    const data = await this.ds.getRepository(MemberRelativeEntity).findOne({ where: { id } });
    if (!data) throw new NotFoundException(`Requested record not found`);
    return new DetailResponse(data.toDto());
  }

  async create(body: CreateMemberRelativeDto) {
    const data = this.ds.getRepository(MemberRelativeEntity).create({ ...body });
    await this.ds.getRepository(MemberRelativeEntity).save(data);
    return new DetailResponse(data);
  }

  async update(id: number, body: UpdateMemberRelativeDto) {
    const data = await this.ds.getRepository(MemberRelativeEntity).preload({ id, ...body });
    if (!data) {
      throw new NotFoundException(`MemberRelative with id ${id} not found`);
    }
    await this.ds.getRepository(MemberRelativeEntity).save(data);
    return new DetailResponse(data);
  }
}
