import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { PaymentTransactionEntity } from '@app/db/group';
import { DetailResponse, PaginateQuery, paginate } from '@app/shared';
import { CreatePaymentTransactionDto, PaymentTransactionPageConfigDto, UpdatePaymentTransactionDto } from '../dtos/payment-transaction.dto';

@Injectable()
export class PaymentTransactionService {
  constructor(private readonly ds: DataSource) {}

  async getAll(query: PaginateQuery, where?: FindOptionsWhere<PaymentTransactionEntity> | FindOptionsWhere<PaymentTransactionEntity>[]) {
    return paginate(query, this.ds.getRepository(PaymentTransactionEntity), { ...PaymentTransactionPageConfigDto, where });
  }

  async findOne(id: number) {
    const data = await this.ds.getRepository(PaymentTransactionEntity).findOne({ where: { id } });
    if (!data) throw new NotFoundException(`Requested record not found`);
    return new DetailResponse(data.toDto());
  }

  async create(body: CreatePaymentTransactionDto) {
    const data = this.ds.getRepository(PaymentTransactionEntity).create({ ...body });
    await this.ds.getRepository(PaymentTransactionEntity).save(data);
    return new DetailResponse(data);
  }

  async update(id: number, body: UpdatePaymentTransactionDto) {
    const data = await this.ds.getRepository(PaymentTransactionEntity).preload({ id, ...body });
    if (!data) {
      throw new NotFoundException(`PaymentTransaction with id ${id} not found`);
    }
    await this.ds.getRepository(PaymentTransactionEntity).save(data);
    return new DetailResponse(data);
  }
}
