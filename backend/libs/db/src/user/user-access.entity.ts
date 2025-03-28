import { BaseEntity, CHANNEL, Channel, USER_ACCESS_STATUS, UserAccessStatus } from '@app/shared';
import { Exclude, instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AccessDeviceEntity } from './access-device.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_accesses' })
export class UserAccessEntity extends BaseEntity {
  @Column({ type: 'enum', enum: CHANNEL, nullable: false })
  @Index()
  accessChannel: Channel;

  @Column({ nullable: true })
  clientName?: string;

  @Column({ nullable: true, length: 2048 })
  allowedUrls?: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  apiClientId?: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  deviceUuid?: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  otpCode?: number;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  secretHash?: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  tempSecretHash?: string;

  @Column({ type: 'enum', enum: USER_ACCESS_STATUS, default: 'PENDING', nullable: false })
  status: UserAccessStatus;

  // User
  @ManyToOne(() => UserEntity, (o: UserEntity) => o.userAccesses, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ name: 'user_id', nullable: false, unsigned: true })
  userId: number;

  // User Devices
  @OneToMany(() => AccessDeviceEntity, (o: AccessDeviceEntity) => o.userAccess, { nullable: true, cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'] })
  accessDevices: AccessDeviceEntity[];

  toDto() {
    return plainToClass(UserAccessEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<UserAccessEntity>) {
    super();
    return Object.assign(this, partial);
  }
}
