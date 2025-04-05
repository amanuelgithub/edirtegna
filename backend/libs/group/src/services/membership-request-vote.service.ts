import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { MembershipRequestVoteEntity } from '@app/db/group';
import { DetailResponse, PaginateQuery, paginate } from '@app/shared';
import { CreateMembershipRequestVoteDto, MembershipRequestVotePageConfigDto, UpdateMembershipRequestVoteDto } from '../dtos/membership-request-vote.dto';

@Injectable()
export class MembershipRequestVoteService {
  constructor(private readonly ds: DataSource) {}

  async getAll(query: PaginateQuery, where?: FindOptionsWhere<MembershipRequestVoteEntity> | FindOptionsWhere<MembershipRequestVoteEntity>[]) {
    return paginate(query, this.ds.getRepository(MembershipRequestVoteEntity), { ...MembershipRequestVotePageConfigDto, where });
  }

  async findOne(id: number) {
    const data = await this.ds.getRepository(MembershipRequestVoteEntity).findOne({ where: { id } });
    if (!data) throw new NotFoundException(`Requested record not found`);
    return new DetailResponse(data.toDto());
  }

  async create(body: CreateMembershipRequestVoteDto) {
    const data = this.ds.getRepository(MembershipRequestVoteEntity).create({ ...body });
    await this.ds.getRepository(MembershipRequestVoteEntity).save(data);
    return new DetailResponse(data);
  }

  async update(id: number, body: UpdateMembershipRequestVoteDto) {
    const data = await this.ds.getRepository(MembershipRequestVoteEntity).preload({ id, ...body });
    if (!data) {
      throw new NotFoundException(`MembershipRequestVote with id ${id} not found`);
    }
    await this.ds.getRepository(MembershipRequestVoteEntity).save(data);
    return new DetailResponse(data);
  }
}
