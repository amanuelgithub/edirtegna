import { BaseEntity, RequestStatus } from '@app/shared';
import { Entity, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { GroupEntity } from './group.entity';
import { UserEntity } from '../user/user.entity';
import { instanceToPlain, plainToClass } from 'class-transformer';

@Entity('emergency_requests')
export class EmergencyRequestEntity extends BaseEntity {
  @ManyToOne(() => GroupEntity, (group) => group.emergencyRequests)
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  group: GroupEntity;

  @Column({ name: 'group_id', unsigned: true })
  groupId: number;

  @ManyToOne(() => UserEntity, (user) => user.emergencyRequests)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ name: 'user_id', unsigned: true })
  userId: number;

  @Column()
  emergencyType: string;

  @Column('text')
  description: string;

  @CreateDateColumn()
  requestDate: Date;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @Column({ nullable: true })
  resolvedDate: Date;

  toDto() {
    return plainToClass(EmergencyRequestEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<EmergencyRequestEntity>) {
    super();
    Object.assign(this, partial);
  }
}
