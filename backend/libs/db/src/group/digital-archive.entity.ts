import { BaseEntity } from '@app/shared';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { GroupEntity } from './group.entity';
import { UserEntity } from '../user/user.entity';
import { instanceToPlain, plainToClass } from 'class-transformer';

@Entity('digital_archives')
export class DigitalArchiveEntity extends BaseEntity {
  @ManyToOne(() => GroupEntity, (group) => group.archives)
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  group: GroupEntity;

  @Column({ name: 'group_id', nullable: false, unsigned: true })
  groupId: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  fileUrl: string;

  @ManyToOne(() => UserEntity, (user) => user.uploadedArchives)
  @JoinColumn({ name: 'uploaded_by', referencedColumnName: 'id' })
  uploadedBy: UserEntity;

  @Column({ name: 'uploaded_by', unsigned: true })
  uploadedById: number;

  @CreateDateColumn()
  uploadDate: Date;

  toDto() {
    return plainToClass(DigitalArchiveEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<DigitalArchiveEntity>) {
    super();
    Object.assign(this, partial);
  }
}
