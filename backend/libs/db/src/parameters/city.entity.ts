import { BaseEntity } from '@app/shared';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserProfileEntity } from '../user';
import { StateEntity } from './state.entity';

@Entity({ name: 'cities' })
export class CityEntity extends BaseEntity {
  @Column()
  cityName: string;

  // State
  @ManyToOne(() => StateEntity, (o: StateEntity) => o.cities, { nullable: false })
  @JoinColumn({ name: 'state_id', referencedColumnName: 'id' })
  state: StateEntity;

  @Column({ name: 'state_id', nullable: false, unsigned: true })
  stateId: number;

  // UserProfiles
  @OneToMany(() => UserProfileEntity, (o: UserProfileEntity) => o.city, { nullable: true })
  userProfiles?: UserProfileEntity[];

  toDto() {
    return plainToClass(CityEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<CityEntity>) {
    super();
    return Object.assign(this, partial);
  }
}
