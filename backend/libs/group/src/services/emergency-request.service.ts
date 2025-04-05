import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { EmergencyRequestPageConfigDto, CreateEmergencyRequestDto, UpdateEmergencyRequestDto } from '../dtos/emergency-request.dto';
import { EmergencyRequestEntity } from '@app/db/group';
import { DetailResponse, PaginateQuery, paginate } from '@app/shared';

@Injectable()
export class EmergencyRequestService {
  constructor(private readonly ds: DataSource) {}

  async getAll(query: PaginateQuery, where?: FindOptionsWhere<EmergencyRequestEntity> | FindOptionsWhere<EmergencyRequestEntity>[]) {
    return paginate(query, this.ds.getRepository(EmergencyRequestEntity), { ...EmergencyRequestPageConfigDto, where });
  }

  async findOne(id: number) {
    const data = await this.ds.getRepository(EmergencyRequestEntity).findOne({ where: { id } });
    if (!data) throw new NotFoundException(`Requested record not found`);
    return new DetailResponse(data.toDto());
  }

  async create(body: CreateEmergencyRequestDto) {
    const data = this.ds.getRepository(EmergencyRequestEntity).create({ ...body });
    await this.ds.getRepository(EmergencyRequestEntity).save(data);
    return new DetailResponse(data);
  }

  async update(id: number, body: UpdateEmergencyRequestDto) {
    const data = await this.ds.getRepository(EmergencyRequestEntity).preload({ id, ...body });
    if (!data) {
      throw new NotFoundException(`EmergencyRequest with id ${id} not found`);
    }
    await this.ds.getRepository(EmergencyRequestEntity).save(data);
    return new DetailResponse(data);
  }
}
