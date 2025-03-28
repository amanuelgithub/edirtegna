import { AccessUserAgent, IsEqualTo, IsPasswordValid } from '@app/shared';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { IChangeOwnCredential, IPreviousAndNewCredential } from '../change-credential';

export class ForgotCredentialDto {
  @IsString()
  identifier: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  deviceUuid?: string;
}
export class ForgotCredentialPayload {
  identifier: string;
  deviceUuid?: string;
  accessChannel: 'WEB' | 'APP';
  realm: 'ADMIN' | 'CUSTOMER';
  userAgent?: AccessUserAgent;
}

export class SetPinCodeDto implements IChangeOwnCredential {
  getPreviousAndNewCredential(): IPreviousAndNewCredential {
    return {
      previousCredential: `${this.previousPin}`,
      newCredential: `${this.pinCode}`,
    };
  }
  @IsString()
  phone: string;

  @IsString()
  deviceUuid: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1000)
  @Max(9999)
  previousPin: number;

  @IsNumber()
  @Type(() => Number)
  @Min(1000)
  @Max(9999)
  pinCode: number;

  @IsNumber()
  @Type(() => Number)
  @Min(1000)
  @Max(9999)
  @IsEqualTo('pinCode')
  confirmPinCode: number;
}

export class SetPasswordDto implements IChangeOwnCredential {
  getPreviousAndNewCredential(): IPreviousAndNewCredential {
    return {
      previousCredential: this.previousPassword,
      newCredential: this.password,
    };
  }
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsString()
  @IsNotEmpty()
  previousPassword: string;

  @IsPasswordValid()
  @MinLength(6)
  @MaxLength(127)
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEqualTo('password')
  confirmPassword: string;
}
