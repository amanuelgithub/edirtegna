import { BaseEntity } from '@app/shared';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import { StateEntity } from './state.entity';
import { CityEntity } from './city.entity';

@Entity({ name: 'countries' })
export class CountryEntity extends BaseEntity {
  @Column()
  countryName: string;

  @Column({ nullable: true })
  prefix?: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ default: false, nullable: true })
  isActive?: boolean;

  // States
  @OneToMany(() => StateEntity, (o: StateEntity) => o.country, { nullable: true })
  states?: StateEntity[];

  // Cities
  @OneToMany(() => CityEntity, (o: CityEntity) => o.country, { nullable: true })
  cities?: CityEntity[];

  toDto() {
    return plainToClass(CountryEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<CountryEntity>) {
    super();
    return Object.assign(this, partial);
  }
}
