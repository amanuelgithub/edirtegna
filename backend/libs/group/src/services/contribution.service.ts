import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { ContributionPageConfigDto, CreateContributionDto, UpdateContributionDto } from '../dtos/contribution.dto';
import { ContributionEntity } from '@app/db/group';
import { DetailResponse, PaginateQuery, paginate } from '@app/shared';

@Injectable()
export class ContributionService {
  constructor(private readonly ds: DataSource) {}

  async getAll(query: PaginateQuery, where?: FindOptionsWhere<ContributionEntity> | FindOptionsWhere<ContributionEntity>[]) {
    return paginate(query, this.ds.getRepository(ContributionEntity), { ...ContributionPageConfigDto, where });
  }

  async findOne(id: number) {
    const data = await this.ds.getRepository(ContributionEntity).findOne({ where: { id } });
    if (!data) throw new NotFoundException(`Requested record not found`);
    return new DetailResponse(data.toDto());
  }

  async create(body: CreateContributionDto) {
    const data = this.ds.getRepository(ContributionEntity).create({ ...body });
    await this.ds.getRepository(ContributionEntity).save(data);
    return new DetailResponse(data);
  }

  async update(id: number, body: UpdateContributionDto) {
    const data = await this.ds.getRepository(ContributionEntity).preload({ id, ...body });
    if (!data) {
      throw new NotFoundException(`Contribution with id ${id} not found`);
    }
    await this.ds.getRepository(ContributionEntity).save(data);
    return new DetailResponse(data);
  }
}
