import { IsValidMsisdn, KeysOf, REALM, Realm, getPhoneFormatNational } from '@app/shared';
import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CustomerPhoneEmailValidationDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(256)
  email?: string;
}

export class PhoneEmailValidationDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @IsOptional()
  @Min(1)
  userId?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  // @IsEmail()
  email?: string;

  @IsString()
  @IsIn(KeysOf(REALM))
  realm: Realm;
}

export class PhoneEmailValidationRespDto {
  email: boolean;
  phone: boolean;
}
export class PhoneEmailValidationPayload {
  private _userId?: number;
  private _phone?: string;
  private _email?: string;
  private _realm: string;

  constructor(dto: PhoneEmailValidationDto) {
    const { userId, phone, email, realm } = dto;
    if (phone) {
      if (!new IsValidMsisdn().validate(phone.trim())) {
        this._phone = phone.trim();
      } else {
        this._phone = getPhoneFormatNational(phone.trim());
      }
    }
    if (email) {
      this._email = email.trim();
    }
    this._realm = realm;
    this._userId = userId;
  }
  public getParameters() {
    return {
      id: this._userId,
      email: this._email,
      phone: this._phone,
      realm: this._realm,
    };
  }
}
