import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { MembershipRequestPageConfigDto, CreateMembershipRequestDto, UpdateMembershipRequestDto } from '../dtos/membership-request.dto';
import { MembershipRequestEntity } from '@app/db/group';
import { DetailResponse, PaginateQuery, paginate } from '@app/shared';

@Injectable()
export class MembershipRequestService {
  constructor(private readonly ds: DataSource) {}

  async getAll(query: PaginateQuery, where?: FindOptionsWhere<MembershipRequestEntity> | FindOptionsWhere<MembershipRequestEntity>[]) {
    return paginate(query, this.ds.getRepository(MembershipRequestEntity), { ...MembershipRequestPageConfigDto, where });
  }

  async findOne(id: number) {
    const data = await this.ds.getRepository(MembershipRequestEntity).findOne({ where: { id } });
    if (!data) throw new NotFoundException(`Requested record not found`);
    return new DetailResponse(data.toDto());
  }

  async create(body: CreateMembershipRequestDto) {
    const data = this.ds.getRepository(MembershipRequestEntity).create({ ...body });
    await this.ds.getRepository(MembershipRequestEntity).save(data);
    return new DetailResponse(data);
  }

  async update(id: number, body: UpdateMembershipRequestDto) {
    const data = await this.ds.getRepository(MembershipRequestEntity).preload({ id, ...body });
    if (!data) {
      throw new NotFoundException(`MembershipRequest with id ${id} not found`);
    }
    await this.ds.getRepository(MembershipRequestEntity).save(data);
    return new DetailResponse(data);
  }
}
