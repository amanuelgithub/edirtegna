import { BaseEntity, REALM, Realm } from '@app/shared';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'roles' })
export class RoleEntity extends BaseEntity {
  @Column()
  @ApiProperty()
  // @Index('idx_role_name', { unique: true })
  name: string;

  @Column({ type: 'enum', enum: REALM, nullable: false })
  realm: Realm;

  @Column({ nullable: true })
  @ApiPropertyOptional()
  description?: string;

  // users
  @OneToMany(() => UserEntity, (o: UserEntity) => o.role, { nullable: true })
  users?: UserEntity[];

  toDto() {
    return plainToClass(RoleEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<RoleEntity>) {
    super();
    return Object.assign(this, partial);
  }
}
