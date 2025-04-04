import { BaseEntity, GroupRole, MembershipStatus } from '@app/shared';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { GroupEntity } from './group.entity';
import { ContributionEntity } from './contribution.entity';
import { instanceToPlain, plainToClass } from 'class-transformer';

@Entity('group_memberships')
export class GroupMembershipEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.groupMemberships, { nullable: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ name: 'user_id', nullable: true, unsigned: true })
  userId: number;

  @ManyToOne(() => GroupEntity, (group) => group.memberships, { nullable: true })
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  group: GroupEntity;

  @Column({ name: 'group_id', nullable: true, unsigned: true })
  groupId: number;

  @CreateDateColumn()
  joinDate: Date;

  @Column({
    type: 'enum',
    enum: GroupRole,
    default: GroupRole.MEMBER,
  })
  role: GroupRole;

  @Column({
    type: 'enum',
    enum: MembershipStatus,
    default: MembershipStatus.ACTIVE,
  })
  status: MembershipStatus;

  @OneToMany(() => ContributionEntity, (contribution) => contribution.membership, { nullable: true })
  contributions: ContributionEntity[];

  toDto() {
    return plainToClass(GroupMembershipEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<GroupMembershipEntity>) {
    super();
    Object.assign(this, partial);
  }
}
