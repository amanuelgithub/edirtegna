import { ApiProperty } from '@nestjs/swagger';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CityEntity, StateEntity } from '../parameters';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_profiles' })
export class UserProfileEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  nationalId?: string;

  @Column({ length: 1024, nullable: true })
  address?: string;

  @Column({ length: 1024, nullable: true })
  profilePic?: string;

  @ManyToOne(() => StateEntity, (o: StateEntity) => o.userProfiles, { nullable: true, eager: true })
  @JoinColumn({ name: 'state_id', referencedColumnName: 'id' })
  state?: StateEntity;

  @ApiProperty()
  @Column({ name: 'state_id', nullable: true, unsigned: true })
  stateId?: number;

  @ManyToOne(() => CityEntity, (o: CityEntity) => o.userProfiles, { nullable: true, eager: true })
  @JoinColumn({ name: 'city_id', referencedColumnName: 'id' })
  city?: CityEntity;

  @ApiProperty()
  @Column({ name: 'city_id', nullable: true, unsigned: true })
  cityId?: number;

  // USER
  @OneToOne(() => UserEntity, (user) => user.userProfile, { nullable: false })
  user: UserEntity;

  toDto() {
    return plainToClass(UserProfileEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<UserProfileEntity>) {
    return Object.assign(this, partial);
  }
}
