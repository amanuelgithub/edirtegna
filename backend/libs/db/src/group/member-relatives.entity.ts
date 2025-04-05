import { BaseEntity } from '@app/shared';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { GroupMembershipEntity } from './group-membership.entity';
import { UserEntity } from '../user/user.entity';
import { instanceToPlain, plainToClass } from 'class-transformer';

@Entity('relatives')
export class MemberRelativeEntity extends BaseEntity {
  @ManyToOne(() => GroupMembershipEntity, (membership) => membership.relatives)
  @JoinColumn({ name: 'membership_id', referencedColumnName: 'id' })
  membership: GroupMembershipEntity;

  @Column({ name: 'membership_id', unsigned: true })
  membershipId: number;

  @Column({ name: 'first_name', length: 50, nullable: false })
  firstName: string;

  @Column({ name: 'last_name', length: 50, nullable: false })
  lastName: string;

  @Column({ name: 'relationship', length: 50, nullable: false })
  relationship: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date | null;

  @CreateDateColumn({ name: 'registered_at' })
  registeredAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.createdTransactions, { nullable: true })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  createdBy: UserEntity;

  @Column({ name: 'created_by', nullable: true, unsigned: true })
  createdById: number | null;

  toDto() {
    return plainToClass(MemberRelativeEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<MemberRelativeEntity>) {
    super();
    Object.assign(this, partial);
  }
}
