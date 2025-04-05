import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import {
  MemberRelativeAdditionRequestPageConfigDto,
  CreateMemberRelativeAdditionRequestDto,
  UpdateMemberRelativeAdditionRequestDto,
} from '../dtos/member-relative-addition-request.dto';
import { MemberRelativeAdditionRequestEntity } from '@app/db/group';
import { DetailResponse, PaginateQuery, paginate } from '@app/shared';

@Injectable()
export class MemberRelativeAdditionRequestService {
  constructor(private readonly ds: DataSource) {}

  async getAll(query: PaginateQuery, where?: FindOptionsWhere<MemberRelativeAdditionRequestEntity> | FindOptionsWhere<MemberRelativeAdditionRequestEntity>[]) {
    return paginate(query, this.ds.getRepository(MemberRelativeAdditionRequestEntity), { ...MemberRelativeAdditionRequestPageConfigDto, where });
  }

  async findOne(id: number) {
    const data = await this.ds.getRepository(MemberRelativeAdditionRequestEntity).findOne({ where: { id } });
    if (!data) throw new NotFoundException(`Requested record not found`);
    return new DetailResponse(data.toDto());
  }

  async create(body: CreateMemberRelativeAdditionRequestDto) {
    const data = this.ds.getRepository(MemberRelativeAdditionRequestEntity).create({ ...body });
    await this.ds.getRepository(MemberRelativeAdditionRequestEntity).save(data);
    return new DetailResponse(data);
  }

  async update(id: number, body: UpdateMemberRelativeAdditionRequestDto) {
    const data = await this.ds.getRepository(MemberRelativeAdditionRequestEntity).preload({ id, ...body });
    if (!data) {
      throw new NotFoundException(`MemberRelativeAdditionRequest with id ${id} not found`);
    }
    await this.ds.getRepository(MemberRelativeAdditionRequestEntity).save(data);
    return new DetailResponse(data);
  }
}
