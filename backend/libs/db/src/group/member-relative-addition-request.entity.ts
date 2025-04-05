import { BaseEntity, REQUEST_STATUS, RequestStatus } from '@app/shared';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { GroupMembershipEntity } from './group-membership.entity';
import { UserEntity } from '../user/user.entity';
import { instanceToPlain, plainToClass } from 'class-transformer';

@Entity('relative_addition_requests')
export class MemberRelativeAdditionRequestEntity extends BaseEntity {
  @ManyToOne(() => GroupMembershipEntity, (membership) => membership.relativeAdditionRequests, { nullable: false })
  @JoinColumn({ name: 'membership_id', referencedColumnName: 'id' })
  membership: GroupMembershipEntity;

  @Column({ name: 'membership_id', nullable: false, unsigned: true })
  membershipId: number;

  @Column({ name: 'first_name', length: 50, nullable: false })
  firstName: string;

  @Column({ name: 'last_name', length: 50, nullable: false })
  lastName: string;

  @Column({ name: 'relationship', length: 50, nullable: false })
  relationship: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date | null;

  @CreateDateColumn({ name: 'request_date' })
  requestDate: Date;

  @Column({
    type: 'enum',
    enum: REQUEST_STATUS,
    default: REQUEST_STATUS.PENDING,
  })
  status: RequestStatus;

  @ManyToOne(() => UserEntity, (user) => user.createdTransactions, { nullable: true })
  @JoinColumn({ name: 'processed_by', referencedColumnName: 'id' })
  processedBy: UserEntity;

  @Column({ name: 'processed_by', nullable: true, unsigned: true })
  processedById: number | null;

  @Column({ name: 'processed_date', type: 'datetime', nullable: true })
  processedDate: Date | null;

  toDto() {
    return plainToClass(MemberRelativeAdditionRequestEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<MemberRelativeAdditionRequestEntity>) {
    super();
    Object.assign(this, partial);
  }
}
