import { BaseEntity } from '@app/shared';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserProfileEntity } from '../user';
import { CityEntity } from './city.entity';

@Entity({ name: 'states' })
export class StateEntity extends BaseEntity {
  @Column()
  stateName: string;

  // UserProfiles
  @OneToMany(() => UserProfileEntity, (o: UserProfileEntity) => o.city, { nullable: true })
  userProfiles?: UserProfileEntity[];

  // cities
  @OneToMany(() => CityEntity, (o: CityEntity) => o.state, { nullable: true })
  cities?: CityEntity[];

  toDto() {
    return plainToClass(StateEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<StateEntity>) {
    super();
    return Object.assign(this, partial);
  }
}
