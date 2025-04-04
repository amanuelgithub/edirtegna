import { BaseEntity, ContributionFrequency, ContributionStatus } from '@app/shared';
import { Entity, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { GroupMembershipEntity } from './group-membership.entity';
import { instanceToPlain, plainToClass } from 'class-transformer';

@Entity('contributions')
export class ContributionEntity extends BaseEntity {
  @ManyToOne(() => GroupMembershipEntity, (membership) => membership.contributions, { nullable: false })
  @JoinColumn({ name: 'membership_id', referencedColumnName: 'id' })
  membership: GroupMembershipEntity;

  @Column({ name: 'membership_id', nullable: false, unsigned: true })
  membershipId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn()
  contributionDate: Date;

  @Column({
    type: 'enum',
    enum: ContributionFrequency,
    default: ContributionFrequency.ONE_TIME,
  })
  frequency: ContributionFrequency;

  @Column({ length: 50 })
  paymentMethod: string;

  @Column({
    type: 'enum',
    enum: ContributionStatus,
    default: ContributionStatus.PENDING,
  })
  status: ContributionStatus;

  toDto() {
    return plainToClass(ContributionEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<ContributionEntity>) {
    super();
    Object.assign(this, partial);
  }
}
