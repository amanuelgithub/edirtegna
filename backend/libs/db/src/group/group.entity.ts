import { BaseEntity } from '@app/shared';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { GroupMembershipEntity } from './group-membership.entity';
import { FinancialTransactionEntity } from './financial-transaction.entity';
import { EventEntity } from './event.entity';
import { MessageEntity } from './message.entity';
import { EmergencyRequestEntity } from './emergency-request.entity';
import { DigitalArchiveEntity } from './digital-archive.entity';
import { instanceToPlain, plainToClass } from 'class-transformer';

@Entity('groups')
export class GroupEntity extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 255 })
  location: string;

  @Column({ type: 'text' })
  bylaws: string;

  @ManyToOne(() => UserEntity, (user) => user.ledGroups, { nullable: true })
  leader: UserEntity;

  @Column({ name: 'leader_id', nullable: true, unsigned: true })
  leaderId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => GroupMembershipEntity, (membership) => membership.group, { nullable: true })
  memberships: GroupMembershipEntity[];

  @OneToMany(() => FinancialTransactionEntity, (transaction) => transaction.group, { nullable: true })
  transactions: FinancialTransactionEntity[];

  @OneToMany(() => EventEntity, (event) => event.group)
  events: EventEntity[];

  @OneToMany(() => MessageEntity, (message) => message.group)
  messages: MessageEntity[];

  @OneToMany(() => EmergencyRequestEntity, (request) => request.group, { nullable: true })
  emergencyRequests: EmergencyRequestEntity[];

  @OneToMany(() => DigitalArchiveEntity, (archive) => archive.group)
  archives: DigitalArchiveEntity[];

  toDto() {
    return plainToClass(GroupEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<GroupEntity>) {
    super();
    Object.assign(this, partial);
  }
}
