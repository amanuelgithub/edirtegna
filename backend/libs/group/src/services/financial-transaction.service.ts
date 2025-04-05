import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { FinancialTransactionPageConfigDto, CreateFinancialTransactionDto, UpdateFinancialTransactionDto } from '../dtos/financial-transaction.dto';
import { FinancialTransactionEntity } from '@app/db/group';
import { DetailResponse, PaginateQuery, paginate } from '@app/shared';

@Injectable()
export class FinancialTransactionService {
  constructor(private readonly ds: DataSource) {}

  async getAll(query: PaginateQuery, where?: FindOptionsWhere<FinancialTransactionEntity> | FindOptionsWhere<FinancialTransactionEntity>[]) {
    return paginate(query, this.ds.getRepository(FinancialTransactionEntity), { ...FinancialTransactionPageConfigDto, where });
  }

  async findOne(id: number) {
    const data = await this.ds.getRepository(FinancialTransactionEntity).findOne({ where: { id } });
    if (!data) throw new NotFoundException(`Requested record not found`);
    return new DetailResponse(data.toDto());
  }

  async create(body: CreateFinancialTransactionDto) {
    const data = this.ds.getRepository(FinancialTransactionEntity).create({ ...body });
    await this.ds.getRepository(FinancialTransactionEntity).save(data);
    return new DetailResponse(data);
  }

  async update(id: number, body: UpdateFinancialTransactionDto) {
    const data = await this.ds.getRepository(FinancialTransactionEntity).preload({ id, ...body });
    if (!data) {
      throw new NotFoundException(`FinancialTransaction with id ${id} not found`);
    }
    await this.ds.getRepository(FinancialTransactionEntity).save(data);
    return new DetailResponse(data);
  }
}
