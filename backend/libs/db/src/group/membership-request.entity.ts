import { BaseEntity, REQUEST_STATUS, RequestStatus } from '@app/shared';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { GroupEntity } from './group.entity';
import { MembershipRequestVoteEntity } from './membership-request-vote.entity';
import { instanceToPlain, plainToClass } from 'class-transformer';

@Entity('join_requests')
export class MembershipRequestEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.membershipRequests, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ name: 'user_id', nullable: false, unsigned: true })
  userId: number;

  @ManyToOne(() => GroupEntity, (group) => group.membershipRequests, { nullable: false })
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  group: GroupEntity;

  @Column({ name: 'group_id', nullable: false, unsigned: true })
  groupId: number;

  @CreateDateColumn({ name: 'request_date' })
  requestDate: Date;

  @Column({
    type: 'enum',
    enum: REQUEST_STATUS,
    default: REQUEST_STATUS.PENDING,
  })
  status: RequestStatus;

  @OneToMany(() => MembershipRequestVoteEntity, (vote) => vote.request, { nullable: true })
  votes: MembershipRequestVoteEntity[];

  toDto() {
    return plainToClass(MembershipRequestEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<MembershipRequestEntity>) {
    super();
    Object.assign(this, partial);
  }
}
