import { UserEntity } from '@app/db';
import { AccessUserAgent, Channel, CustomerLevel, getPhoneFormatNational, IsValidMsisdn, ObjectUtil, StringUtil, UserStatus } from '@app/shared';
import { BadRequestException } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { existsSync, unlinkSync } from 'fs';

// export class UpdateUserDto {
//   @IsString()
//   @IsNotEmpty()
//   @IsOptional()
//   @MinLength(5, {
//     message: 'first Name is too short. At least, it should be $constraint1 characters, but actual is $value',
//   })
//   firstName?: string;

//   @IsString()
//   @IsOptional()
//   middleName?: string;

//   @IsString()
//   @IsOptional()
//   lastName?: string;

//   @IsString()
//   @IsNotEmpty()
//   @IsOptional()
//   phone?: string;

//   @IsString()
//   @IsNotEmpty()
//   @IsOptional()
//   profilePic?: string;

//   @IsNumber()
//   @IsOptional()
//   @Type(() => Number)
//   partnerId?: number;

//   // @IsIn(KeysOf(ROLE))
//   // @IsNotEmpty()
//   // @IsOptional()
//   // role?: Role;

//   @IsNumber()
//   @Type(() => Number)
//   @IsOptional()
//   roleId?: number;

//   @IsString()
//   @IsEmail()
//   @IsNotEmpty()
//   @IsOptional()
//   email?: string;

//   @IsString()
//   @Type(() => String)
//   @IsNotEmpty()
//   @IsOptional()
//   @IsIn(['ACTIVE', 'BLOCKED'])
//   status?: UserStatus;

//   @IsString()
//   @IsNotEmpty()
//   @IsOptional()
//   address?: string;

//   @IsString()
//   @IsNotEmpty()
//   @IsOptional()
//   postalCode?: string;

//   @IsString()
//   @IsNotEmpty()
//   @IsOptional()
//   nationalId?: string;
// }

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(5, {
    message: 'First name is too short. At least $constraint1 characters are required.',
  })
  firstName?: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  phone?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  profilePic?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  partnerId?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  roleId?: number;

  @IsString()
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @Type(() => String)
  @IsOptional()
  @IsIn(['ACTIVE', 'BLOCKED'])
  status?: UserStatus;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  address?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  postalCode?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  nationalId?: string;
}

export class UpdateUserPayload {
  private _userId: number;
  private _user: UserEntity;
  private _oldProfilePic?: string;

  // Profile info
  private _firstName?: string;
  private _middleName?: string;
  private _lastName?: string;
  private _phone?: string;
  private _profilePic?: string;
  private _roleId?: number;
  private _email?: string;
  private _status?: UserStatus;
  private _address?: string;
  private _nationalId?: string;
  private _postalCode?: string;
  private _partnerId?: number;

  // Customer profile
  private _commission?: number;
  private _customerLevel?: CustomerLevel;
  private _zoneRegionId?: number;
  private _zoneRegionshortCode?: number;
  private _shortCode?: number;
  private _identifier?: number;
  private _securityCredential?: string;

  // Metadata
  private _channel: Channel;
  private _ip: string;
  private _updatedBy: number;
  private _device?: AccessUserAgent;

  constructor(dto: UpdateUserDto, userId: number, channel: Channel, ip: string, updatedBy: number, device?: AccessUserAgent) {
    const { firstName, middleName, lastName, phone, roleId, email, status, profilePic, address, postalCode, nationalId, partnerId } = dto;

    this._userId = userId;
    this._firstName = firstName ? StringUtil.toTitleCase(firstName) : undefined;
    this._middleName = middleName ? StringUtil.toTitleCase(middleName) : undefined;
    this._lastName = lastName ? StringUtil.toTitleCase(lastName) : undefined;

    if (phone && !new IsValidMsisdn().validate(phone.trim())) {
      throw new BadRequestException(`Invalid phone number: ${phone}`);
    }
    this._phone = phone ? getPhoneFormatNational(phone.trim()) : undefined;
    this._roleId = roleId;
    this._email = email?.trim();
    this._profilePic = profilePic;
    this._partnerId = partnerId;
    this._channel = channel;
    this._status = status;
    this._address = address;
    this._postalCode = postalCode;
    this._nationalId = nationalId;
    this._ip = ip;
    this._updatedBy = updatedBy;
    this._device = device;
  }

  private isValidUserStatus(): void {
    if (this._user.status === 'SUSPENDED') {
      throw new BadRequestException('Account is disabled or suspended');
    }
  }

  private handleProfilePicUpdate(): void {
    if (this._user.userProfile.profilePic && this._profilePic && existsSync(this._user.userProfile.profilePic)) {
      this._oldProfilePic = this._user.userProfile.profilePic;
    }
  }

  public getUpdatePayload(): Partial<UserEntity> {
    return ObjectUtil.pruneNullAndUndefined({
      id: this._userId,
      phone: this._phone,
      roleId: this._roleId,
      email: this._email,
      userProfile: {
        firstName: this._firstName,
        middleName: this._middleName,
        lastName: this._lastName,
        profilePic: this._profilePic,
        address: this._address,
        postalCode: this._postalCode,
        nationalId: this._nationalId,
        partnerId: this._partnerId,
      },
      // customerProfile: {
      //   commission: this._commission,
      //   customerLevel: this._customerLevel,
      //   telebirrProfile: {
      //     zoneRegionId: this._zoneRegionId,
      //     zoneRegionshortCode: this._zoneRegionshortCode,
      //     shortCode: this._shortCode,
      //     identifier: this._identifier,
      //     securityCredential: this._securityCredential,
      //   },
      // },
      status: this._status,
    });
  }

  public validateUpdate(user: UserEntity, isPhoneUsed: boolean, isEmailUsed: boolean): void {
    this._user = user;
    this.isValidUserStatus();
    this.handleProfilePicUpdate();

    if (isPhoneUsed) {
      throw new BadRequestException(`Phone number ${this._phone} is already used`);
    }
    if (isEmailUsed) {
      throw new BadRequestException(`Email ${this._email} is already used`);
    }
  }

  public deleteOldProfilePic(): void {
    if (this._oldProfilePic && existsSync(this._oldProfilePic)) {
      unlinkSync(this._oldProfilePic);
    }
  }
}

export class UpdateUserStatusDto {
  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  @IsOptional()
  @IsIn(['ACTIVE', 'BLOCKED'])
  status?: UserStatus;
}

export class UpdateUserStatusPayload {
  private _userId: number;
  private _status: UserStatus;

  // Request user details...
  private _channel: Channel;
  private _ip: string;
  private _updatedBy: number;
  private _device: AccessUserAgent;

  private _user: UserEntity;

  constructor(dto: UpdateUserStatusDto, userId: number, channel: Channel, ip: string, updatedBy: number, device?: AccessUserAgent) {
    const { status } = dto;
    this._userId = userId;

    if (status) {
      this._status = status;
    }

    this._channel = channel;
    this._ip = ip;
    this._updatedBy = updatedBy;
    this._device = device;
  }

  private isValidUserStatus() {
    if (['SUSPENDED'].includes(this._user.status)) {
      throw new BadRequestException(`Account is disabled or suspended`);
    }
  }

  public getUpdateStatusPayload() {
    return {
      id: this._userId,
      status: this._status,
    };
  }
}
