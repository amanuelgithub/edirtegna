import { BaseEntity } from '@app/shared';
import { plainToClass } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'activity_logs' })
export class ActivityLogEntity extends BaseEntity {
  @Column()
  logTitle: string;

  @Column({ type: 'text' })
  logText: string;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  ua?: string;

  // User - Action By
  @ManyToOne(() => UserEntity, (o: UserEntity) => o.activityLogs, { nullable: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: UserEntity;

  @Column({ name: 'user_id', nullable: true, unsigned: true })
  userId?: number;

  toDto() {
    return plainToClass(ActivityLogEntity, this);
  }
  constructor(partial: Partial<ActivityLogEntity>) {
    super();
    return Object.assign(this, partial);
  }
}
