import { BaseEntity, NOTIFICATION_STATUS, NOTIFICATION_TYPE, NotificationStatus, NotificationType } from '@app/shared';
import { Exclude, instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../user';

@Entity({ name: 'notifications' })
export class NotificationEntity extends BaseEntity {
  @Column()
  subject: string;

  @Column({ type: 'text' })
  @Exclude()
  message: string;

  @Column()
  destination: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  isRead: boolean;

  @Column({ type: 'enum', enum: NOTIFICATION_TYPE, nullable: false })
  type: NotificationType;

  @Column({ type: 'enum', enum: NOTIFICATION_STATUS, default: 'PENDING', nullable: false })
  status: NotificationStatus;

  // RELATIONS

  // Users
  @ManyToOne(() => UserEntity, (o: UserEntity) => o.notifications, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ name: 'user_id', nullable: false, unsigned: true })
  userId: number;

  toDto() {
    return plainToClass(NotificationEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<NotificationEntity>) {
    super();
    return Object.assign(this, partial);
  }
}
