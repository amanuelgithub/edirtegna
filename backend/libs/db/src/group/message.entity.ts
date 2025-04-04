import { BaseEntity } from '@app/shared';
import { Entity, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { GroupEntity } from './group.entity';
import { UserEntity } from '../user/user.entity';
import { instanceToPlain, plainToClass } from 'class-transformer';

@Entity('messages')
export class MessageEntity extends BaseEntity {
  @ManyToOne(() => GroupEntity, (group) => group.messages, { nullable: false })
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  group: GroupEntity;

  @Column({ name: 'group_id', nullable: false, unsigned: true })
  groupId: number;

  @ManyToOne(() => UserEntity, (user) => user.messages, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ name: 'user_id', nullable: false, unsigned: true })
  userId: number;

  // @ManyToOne(() => MessageEntity, (message) => message.replies, { nullable: true })
  // @JoinColumn({ name: 'thread_id', referencedColumnName: 'id' })
  // thread: MessageEntity;

  // @Column({ nullable: true, name: 'thread_id', unsigned: true })
  // threadId: number;

  @Column('text')
  messageText: string;

  @CreateDateColumn()
  messageDate: Date;

  // @OneToMany(() => MessageEntity, (message) => message.thread)
  // replies: MessageEntity[];

  toDto() {
    return plainToClass(MessageEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<MessageEntity>) {
    super();
    Object.assign(this, partial);
  }
}
