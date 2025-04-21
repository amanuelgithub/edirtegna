import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { CountryPageConfigDto, CreateCountryDto, UpdateCountryDto } from '../dtos/country.dto';
import { CountryEntity } from '@app/db/parameters';
import { DetailResponse, PaginateQuery, paginate } from '@app/shared';

@Injectable()
export class CountryService {
  constructor(private readonly ds: DataSource) {}

  async getAll(query: PaginateQuery, where?: FindOptionsWhere<CountryEntity> | FindOptionsWhere<CountryEntity>[]) {
    return paginate(query, this.ds.getRepository(CountryEntity), { ...CountryPageConfigDto, where });
  }

  async findOne(id: number) {
    const data = await this.ds.getRepository(CountryEntity).findOne({ where: { id } });
    if (!data) throw new NotFoundException(`Requested record not found`);
    return new DetailResponse(data.toDto());
  }

  async create(body: CreateCountryDto, icon: string) {
    console.log('create country data: ', body);
    const data = this.ds.getRepository(CountryEntity).create({ ...body, icon: icon });
    await this.ds.getRepository(CountryEntity).save(data);
    return new DetailResponse(data);
  }

  async update(id: number, body: UpdateCountryDto, icon?: string) {
    const data = await this.ds.getRepository(CountryEntity).preload({ id, ...body });
    if (!data) {
      throw new NotFoundException(`Country with id ${id} not found`);
    }
    await this.ds.getRepository(CountryEntity).save(data);
    return new DetailResponse(data);
  }
}
