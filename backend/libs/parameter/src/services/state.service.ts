import { StateEntity } from '@app/db/parameters';
import { DetailResponse, PaginateQuery, Paginated, paginate } from '@app/shared';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { CreateStateDto, StatePageConfigDto, UpdateStateDto } from '../dtos/state.dto';

@Injectable()
export class StateService {
  constructor(private readonly ds: DataSource) {}

  async getAll(query: PaginateQuery, where?: FindOptionsWhere<StateEntity> | FindOptionsWhere<StateEntity>[]): Promise<Paginated<StateEntity>> {
    return paginate(query, this.ds.getRepository(StateEntity), { ...StatePageConfigDto, where });
  }

  async findOne(id: number) {
    const data = await this.ds.getRepository(StateEntity).findOne({ where: { id } });
    if (!data) throw new BadRequestException('Requested record not found');
    return new DetailResponse(data.toDto());
  }

  async create(body: CreateStateDto) {
    const data = this.ds.getRepository(StateEntity).create(body);
    await this.ds.getRepository(StateEntity).save(data);
    return new DetailResponse(data);
  }

  async update(id: number, body: UpdateStateDto) {
    const data = await this.ds.getRepository(StateEntity).preload({ id, ...body });
    if (!data) {
      throw new NotFoundException(`State with Id ${id} was not found`);
    }
    await this.ds.getRepository(StateEntity).save(data);
    return new DetailResponse(data);
  }

  async delete(id) {
    const result = await this.ds.getRepository(StateEntity).delete(id);

    if (result.affected == 0) {
      throw new NotFoundException(`Unable to delete state with id ${id}`);
    }

    return new DetailResponse();
  }
}
