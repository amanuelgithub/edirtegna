import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterCustomerDto {
  // @IsString()
  // @MinLength(5, {
  //   message: 'fullName is too short. Atleast, it should be $constraint1 characters, but actual is $value',
  // })
  // @IsOptional()
  // fullName?: string;

  // @IsString()
  // phone: string;

  // @IsString()
  // @IsNotEmpty()
  // identifier: string;

  @IsString()
  @MinLength(5, {
    message: 'first Name is too short. Atleast, it should be $constraint1 characters, but actual is $value',
  })
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone?: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @IsOptional()
  parentId?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  profilePic?: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  // @IsString()
  // @IsIn(KeysOf(CUSTOMER_ROLE))
  // role: CustomerRole;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  roleId?: number;

  // // WALLET
  // @IsNumber()
  // @Type(() => Number)
  // @IsNotEmpty()
  // @IsOptional()
  // currencyId?: number;

  // // CUSTOMER PROFILE
  // @IsBoolean()
  // @Type(() => Boolean)
  // @IsNotEmpty()
  // @IsOptional()
  // shareParentWallet?: boolean;

  // @IsBoolean()
  // @Type(() => Boolean)
  // @IsNotEmpty()
  // @IsOptional()
  // canCreateSubAccounts?: boolean;

  // @IsNumber()
  // @Type(() => Number)
  // @IsNotEmpty()
  // @IsOptional()
  // walletAlertThreshold?: number;

  // @IsNumber()
  // @Type(() => Number)
  // @IsNotEmpty()
  // @IsOptional()
  // maximumDailyWalletThreshold?: number;

  // // @IsArray()
  // // @ValidateNested({ each: true })
  // // @Type(() => ProductPriceListDto)
  // // @IsNotEmpty()
  // // @IsOptional()
  // // productPrices?: ProductPriceListDto[];

  // @IsArray()
  // // @ArrayMinSize(1)
  // @IsString({ each: true })
  // @IsOptional()
  // @IsNotEmpty()
  // productPrices?: string[];
}
