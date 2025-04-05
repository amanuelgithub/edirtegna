import { BaseEntity } from '@app/shared';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { UserProfileEntity } from '../user';
import { CityEntity } from './city.entity';
import { CountryEntity } from './country.entity';

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

  // Country
  @ManyToOne(() => CountryEntity, (o: CountryEntity) => o.states, { nullable: false })
  @JoinColumn({ name: 'country_id', referencedColumnName: 'id' })
  country: CountryEntity;

  @Column({ name: 'country_id', nullable: false, unsigned: true })
  countryId: number;

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
