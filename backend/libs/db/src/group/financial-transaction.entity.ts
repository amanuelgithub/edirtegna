import { BaseEntity, TRANSACTION_TYPE, TransactionType } from '@app/shared';
import { Entity, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { GroupEntity } from './group.entity';
import { UserEntity } from '../user/user.entity';
import { instanceToPlain, plainToClass } from 'class-transformer';

@Entity('financial_transactions')
export class FinancialTransactionEntity extends BaseEntity {
  @ManyToOne(() => GroupEntity, (group) => group.transactions, { nullable: false })
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  group: GroupEntity;

  @Column({ name: 'group_id', nullable: false, unsigned: true })
  groupId: number;

  @Column({
    type: 'enum',
    enum: TRANSACTION_TYPE,
  })
  transactionType: TransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column('text')
  description: string;

  @CreateDateColumn()
  transactionDate: Date;

  @ManyToOne(() => UserEntity, (user) => user.createdTransactions)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  createdBy: UserEntity;

  @Column({ name: 'created_by', unsigned: true })
  createdById: number;

  @ManyToOne(() => UserEntity, (user) => user.approvedTransactions, { nullable: true })
  @JoinColumn({ name: 'approved_by', referencedColumnName: 'id' })
  approvedBy: UserEntity;

  @Column({ nullable: true, name: 'approved_by', unsigned: true })
  approvedById: number;

  toDto() {
    return plainToClass(FinancialTransactionEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<FinancialTransactionEntity>) {
    super();
    Object.assign(this, partial);
  }
}
