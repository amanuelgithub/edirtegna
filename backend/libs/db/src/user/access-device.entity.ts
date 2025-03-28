import { Exclude, instanceToPlain, plainToClass } from 'class-transformer';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserAccessEntity } from './user-access.entity';

@Entity({ name: 'access_devices' })
// @Index((u: AccessDeviceEntity) => [u.deviceHash, u.userAccessId], { unique: true })
export class AccessDeviceEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  // device info

  @Column({ nullable: true })
  ua?: string;

  @Column({ nullable: true })
  browser?: string;

  @Column({ nullable: true })
  engine?: string;

  @Column({ nullable: true })
  os?: string;

  @Column({ nullable: true })
  device?: string;

  @Column({ nullable: true })
  cpu?: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  isActive: boolean;

  // Additional
  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  deviceHash?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedDate?: Date;

  // User Aess
  @ManyToOne(() => UserAccessEntity, (o: UserAccessEntity) => o.accessDevices, { nullable: false })
  @JoinColumn({ name: 'user_access_id', referencedColumnName: 'id' })
  userAccess: UserAccessEntity;

  @Column({ name: 'user_access_id', nullable: false, unsigned: true })
  userAccessId: number;

  toDto() {
    return plainToClass(AccessDeviceEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<AccessDeviceEntity>) {
    return Object.assign(this, partial);
  }
}
