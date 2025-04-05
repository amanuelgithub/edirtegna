import { BaseEntity } from '@app/shared';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { MembershipRequestEntity } from './membership-request.entity';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { UserEntity } from '../user/user.entity';

export const VOTE_TYPE = {
  APPROVE: 'approve',
  REJECT: 'reject',
} as const;
export type VoteType = keyof typeof VOTE_TYPE;

@Entity('join_votes')
export class MembershipRequestVoteEntity extends BaseEntity {
  @ManyToOne(() => MembershipRequestEntity, (request) => request.votes, { nullable: false })
  @JoinColumn({ name: 'request_id', referencedColumnName: 'id' })
  request: MembershipRequestEntity;

  @Column({ name: 'request_id', nullable: false, unsigned: true })
  requestId: number;

  @ManyToOne(() => UserEntity, (user) => user.membershipRequestVotes, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ name: 'user_id', nullable: false, unsigned: true })
  userId: number;

  @Column({
    type: 'enum',
    enum: VOTE_TYPE,
  })
  vote: VoteType;

  @CreateDateColumn({ name: 'vote_date' })
  voteDate: Date;

  @Column({ name: 'internal_user_reference', nullable: true, length: 255 })
  internalUserReference: string | null;

  toDto() {
    return plainToClass(MembershipRequestVoteEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<MembershipRequestVoteEntity>) {
    super();
    Object.assign(this, partial);
  }
}
