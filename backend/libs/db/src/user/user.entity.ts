import { BaseEntity, REALM, Realm, REGISTRATION_PROVIDER, RegistrationProvider, USER_STATUS, UserStatus } from '@app/shared';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { RoleEntity } from './role.entity';
import { UserProfileEntity } from './user-profile.entity';
import { ActivityLogEntity } from './activity-log.entity';
import { UserAccessEntity } from './user-access.entity';
import { NotificationEntity } from '../notification';
import { GroupEntity } from '../group/group.entity';
import { GroupMembershipEntity } from '../group/group-membership.entity';
import { FinancialTransactionEntity } from '../group/financial-transaction.entity';
import { EventEntity } from '../group/event.entity';
import { MessageEntity } from '../group/message.entity';
import { EmergencyRequestEntity } from '../group/emergency-request.entity';
import { DigitalArchiveEntity } from '../group/digital-archive.entity';
import { PaymentTransactionEntity } from '../group/payment-transaction.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  @Exclude({ toPlainOnly: true })
  idpId: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'enum', enum: REGISTRATION_PROVIDER, default: 'LOCAL', nullable: false })
  registrationProvider: RegistrationProvider;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  socialProfileId?: string;

  @Column({ type: 'enum', enum: REALM, nullable: false })
  realm: Realm;

  @ManyToOne(() => RoleEntity, (o: RoleEntity) => o.users, { nullable: false, eager: true })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: RoleEntity;

  @ApiProperty()
  @Column({ name: 'role_id', nullable: false, unsigned: true })
  roleId: number;

  @Column({ nullable: true })
  createdBy: number;

  @Column({ type: 'enum', enum: USER_STATUS, default: 'PENDING', nullable: false })
  status: UserStatus;

  // UserProfile
  @OneToOne(() => UserProfileEntity, (o) => o.user, { cascade: true, nullable: true, eager: true }) // specify inverse side as a second parameter
  @JoinColumn({ name: 'user_profile_id', referencedColumnName: 'id' })
  userProfile?: UserProfileEntity;

  @Column({ name: 'user_profile_id', nullable: true, unsigned: true })
  userProfileId?: number;

  // ActivityLogEntity
  @OneToMany(() => ActivityLogEntity, (o: ActivityLogEntity) => o.user, { nullable: true })
  activityLogs: ActivityLogEntity[];

  // Notifications
  @OneToMany(() => NotificationEntity, (o: NotificationEntity) => o.user, { nullable: true })
  notifications: NotificationEntity[];

  // User Devices
  @OneToMany(() => UserAccessEntity, (o: UserAccessEntity) => o.user, { nullable: true, cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'] })
  userAccesses: UserAccessEntity[];

  // Group Relationships
  @OneToMany(() => GroupEntity, (group) => group.leader, { nullable: true })
  ledGroups: GroupEntity[];

  @OneToMany(() => GroupMembershipEntity, (membership) => membership.user, { nullable: true })
  groupMemberships: GroupMembershipEntity[];

  @OneToMany(() => FinancialTransactionEntity, (transaction) => transaction.createdBy, { nullable: true })
  createdTransactions: FinancialTransactionEntity[];

  @OneToMany(() => FinancialTransactionEntity, (transaction) => transaction.approvedBy, { nullable: true })
  approvedTransactions: FinancialTransactionEntity[];

  @OneToMany(() => EventEntity, (event) => event.createdBy, { nullable: true })
  createdEvents: EventEntity[];

  @OneToMany(() => MessageEntity, (message) => message.user, { nullable: true })
  messages: MessageEntity[];

  @OneToMany(() => EmergencyRequestEntity, (request) => request.user, { nullable: true })
  emergencyRequests: EmergencyRequestEntity[];

  @OneToMany(() => DigitalArchiveEntity, (archive) => archive.uploadedBy, { nullable: true })
  uploadedArchives: DigitalArchiveEntity[];

  @OneToMany(() => PaymentTransactionEntity, (payment) => payment.user, { nullable: true })
  paymentTransactions: PaymentTransactionEntity[];

  // agents
  toDto() {
    return plainToClass(UserEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
