import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { DigitalArchivePageConfigDto, CreateDigitalArchiveDto, UpdateDigitalArchiveDto } from '../dtos/digital-archive.dto';
import { DigitalArchiveEntity } from '@app/db/group';
import { DetailResponse, PaginateQuery, paginate } from '@app/shared';

@Injectable()
export class DigitalArchiveService {
  constructor(private readonly ds: DataSource) {}

  async getAll(query: PaginateQuery, where?: FindOptionsWhere<DigitalArchiveEntity> | FindOptionsWhere<DigitalArchiveEntity>[]) {
    return paginate(query, this.ds.getRepository(DigitalArchiveEntity), { ...DigitalArchivePageConfigDto, where });
  }

  async findOne(id: number) {
    const data = await this.ds.getRepository(DigitalArchiveEntity).findOne({ where: { id } });
    if (!data) throw new NotFoundException(`Requested record not found`);
    return new DetailResponse(data.toDto());
  }

  async create(body: CreateDigitalArchiveDto) {
    const data = this.ds.getRepository(DigitalArchiveEntity).create({ ...body });
    await this.ds.getRepository(DigitalArchiveEntity).save(data);
    return new DetailResponse(data);
  }

  async update(id: number, body: UpdateDigitalArchiveDto) {
    const data = await this.ds.getRepository(DigitalArchiveEntity).preload({ id, ...body });
    if (!data) {
      throw new NotFoundException(`DigitalArchive with id ${id} not found`);
    }
    await this.ds.getRepository(DigitalArchiveEntity).save(data);
    return new DetailResponse(data);
  }
}
