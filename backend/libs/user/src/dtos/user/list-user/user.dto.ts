import { ROLE, Role, UserEntity } from '@app/db';
import { BasePageOptionsDto, FilterOperator, KeysOf, PaginateConfig, REALM, Realm, SelectOneConfig, USER_STATUS, UserStatus, copyConfig } from '@app/shared';
import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserPageOptionsDto extends BasePageOptionsDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  idpId?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  parentUserName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phoneOrName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  createdAtRange?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  parentCustomerId?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  partnerId?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  roleId?: number;

  @IsNotEmpty()
  @IsOptional()
  @IsIn(KeysOf(REALM))
  realm?: Realm;

  @IsIn(KeysOf(USER_STATUS))
  @IsNotEmpty()
  @IsOptional()
  status?: UserStatus;

  @IsIn(KeysOf(ROLE))
  @IsNotEmpty()
  @IsOptional()
  role?: Role;

  @IsIn(KeysOf(ROLE), { each: true })
  @IsNotEmpty()
  @IsOptional()
  roles?: Role[];

  @IsNotEmpty()
  @IsOptional()
  roleIds?: number[];
}

export const UserPageConfig: PaginateConfig<UserEntity> = {
  sortableColumns: [
    'id',
    'userProfile.firstName',
    'userProfile.middleName',
    'userProfile.lastName',
    'userProfile.profilePic',
    'email',
    'phone',
    'roleId',
    'status',
    'createdAt',
    'updatedAt',
  ],
  defaultSortBy: [['createdAt', 'DESC']],
  searchableColumns: ['userProfile.firstName', 'email', 'phone', 'status', 'roleId'],
  select: [
    'id',
    'userProfile.id',
    'userProfile.firstName',
    'userProfile.middleName',
    'userProfile.lastName',
    'userProfile.profilePic',
    'roleId',
    'role.name',
    'email',
    'phone',
    'status',
    // 'userProfile.partnerId',
    // 'userProfile.partner.partnerName',
    'createdAt',
    'updatedAt',
  ],
  filterableColumns: {
    roleId: [FilterOperator.EQ, FilterOperator.IN],
    email: [FilterOperator.ILIKE],
    phone: [FilterOperator.ILIKE],
    createdAt: [FilterOperator.BTW],
    updatedAt: [FilterOperator.BTW],
    id: [FilterOperator.ILIKE],
    status: [FilterOperator.EQ],
    'userProfile.firstName': [FilterOperator.ILIKE],
    // 'userProfile.partnerId': [FilterOperator.EQ],
    // 'userProfile.partner.partnerName': [FilterOperator.ILIKE],
  },
  // relations: ['userProfile', 'userProfile.partner', 'role'],
  relations: ['userProfile', 'role'],
};

export const UserSelectOneConfig = copyConfig(UserPageConfig) as SelectOneConfig<UserEntity>;
