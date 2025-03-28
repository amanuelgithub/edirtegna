// import { CreateProductPriceDto } from '@app/product/dtos';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterPartnerUserDto {
  @IsString()
  @MinLength(5, {
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

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  // WALLET
  // @IsNumber()
  // @Type(() => Number)
  // @IsNotEmpty()
  // @IsOptional()
  // currencyId?: number;

  // CUSTOMER PROFILE
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

  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CreateProductPriceDto)
  // @IsNotEmpty()
  // @IsOptional()
  // productPrices?: CreateProductPriceDto[];
}
