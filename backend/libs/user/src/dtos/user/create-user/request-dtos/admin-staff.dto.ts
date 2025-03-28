import { Realm } from '@app/shared';
import { Type } from 'class-transformer';
import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

// asd;
export class RegisterAdminStaffDto {
  @IsString()
  @MinLength(2, {
    message: 'first Name is too short. Atleast, it should be $constraint1 characters, but actual is $value',
  })
  firstName: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  profilePic?: string;

  // @IsIn(['ADMIN', 'FINANCE', 'ACCOUNTS_MANAGER'])
  @IsNumber()
  @Type(() => Number)
  roleId: number;

  @IsString()
  @IsEmail()
  email: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  companyId?: number;

  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  @IsOptional()
  @IsIn(['ADMIN', 'CUSTOMER'])
  realm?: Realm;
}

export class RegisterCustomerStaffDto extends RegisterAdminStaffDto {
  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  @IsOptional()
  @IsIn(['ADMIN', 'CUSTOMER'])
  realm?: Realm;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  partnerId: number;
}
