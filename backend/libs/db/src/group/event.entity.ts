import { BaseEntity, EventType } from '@app/shared';
import { Entity, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { GroupEntity } from './group.entity';
import { UserEntity } from '../user/user.entity';
import { instanceToPlain, plainToClass } from 'class-transformer';

@Entity('events')
export class EventEntity extends BaseEntity {
  @ManyToOne(() => GroupEntity, (group) => group.events, { nullable: false })
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  group: GroupEntity;

  @Column({ name: 'group_id', nullable: false, unsigned: true })
  groupId: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: EventType,
  })
  eventType: EventType;

  @Column()
  startDateTime: Date;

  @Column({ nullable: true })
  endDateTime: Date;

  @Column()
  location: string;

  @ManyToOne(() => UserEntity, (user) => user.createdEvents, { nullable: false })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  createdBy: UserEntity;

  @Column({ name: 'created_by', unsigned: true, nullable: false })
  createdById: number;

  @CreateDateColumn()
  createdAt: Date;

  toDto() {
    return plainToClass(EventEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<EventEntity>) {
    super();
    Object.assign(this, partial);
  }
}
