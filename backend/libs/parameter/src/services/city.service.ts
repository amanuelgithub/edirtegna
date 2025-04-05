import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { CityPageConfigDto, CreateCityDto, UpdateCityDto } from '../dtos/city.dto';
import { CityEntity } from '@app/db/parameters';
import { DetailResponse, PaginateQuery, paginate } from '@app/shared';

@Injectable()
export class CityService {
  constructor(private readonly ds: DataSource) {}

  async getAll(query: PaginateQuery, where?: FindOptionsWhere<CityEntity> | FindOptionsWhere<CityEntity>[]) {
    return paginate(query, this.ds.getRepository(CityEntity), { ...CityPageConfigDto, where });
  }

  async findOne(id: number) {
    const data = await this.ds.getRepository(CityEntity).findOne({ where: { id } });
    if (!data) throw new NotFoundException(`Requested record not found`);
    return new DetailResponse(data.toDto());
  }

  async create(body: CreateCityDto) {
    const data = this.ds.getRepository(CityEntity).create({ ...body });
    await this.ds.getRepository(CityEntity).save(data);
    return new DetailResponse(data);
  }

  async update(id: number, body: UpdateCityDto) {
    const data = await this.ds.getRepository(CityEntity).preload({ id, ...body });
    if (!data) {
      throw new NotFoundException(`City with id ${id} not found`);
    }
    await this.ds.getRepository(CityEntity).save(data);
    return new DetailResponse(data);
  }
}
