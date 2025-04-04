import { BaseEntity, PAYMENT_TYPE, PAYMENT_STATUS, PaymentType, PaymentStatus } from '@app/shared';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { instanceToPlain, plainToClass } from 'class-transformer';

@Entity('payment_transactions')
export class PaymentTransactionEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.paymentTransactions)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ name: 'user_id', unsigned: true })
  userId: number;

  @Column()
  externalTxnId: string;

  // @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: PAYMENT_TYPE,
  })
  transactionType: PaymentType;

  @Column({
    type: 'enum',
    enum: PAYMENT_STATUS,
    default: PAYMENT_STATUS.PENDING,
  })
  status: PaymentStatus;

  @CreateDateColumn()
  createdAt: Date;

  toDto() {
    return plainToClass(PaymentTransactionEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<PaymentTransactionEntity>) {
    super();
    Object.assign(this, partial);
  }
}
