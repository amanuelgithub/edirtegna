import { UserEntity } from '@app/db';
import { Channel, IRequestDetail } from '@app/shared';
import { UserBuilder } from './base';
import { IUserBuilder } from './interfaces';
import { RegisterAdminStaffDto, RegisterCustomerStaffDto } from './request-dtos';

export class AdministrativeUserBuilder implements IUserBuilder {
  private dto: RegisterAdminStaffDto;
  private builder: UserBuilder;
  constructor(dto: RegisterAdminStaffDto, requestInfo: IRequestDetail) {
    this.dto = dto;
    this.builder = new UserBuilder(requestInfo);
  }

  async getUser(): Promise<UserEntity> {
    const { firstName, middleName, lastName, phone, email, profilePic, roleId, companyId, realm } = this.dto;
    this.builder = this.builder
      .setFirstName(firstName)
      .setMiddleName(middleName)
      .setLastName(lastName)
      .setPhone(phone)
      .setEmail(email)
      .setRole(roleId)
      .setRealm(realm)
      .setPartnerId(companyId)
      .setProfilePic(profilePic);
    this.builder = await this.builder.addUserAccesses(['WEB']);
    return this.builder.build();
  }
  getNotificationDetail(userId: number, channel?: Channel) {
    return this.builder.getNotificationDetail(userId, channel);
  }
}

export class AdministrativeCustomerUserBuilder implements IUserBuilder {
  private dto: RegisterCustomerStaffDto;
  private builder: UserBuilder;
  constructor(dto: RegisterCustomerStaffDto, requestInfo: IRequestDetail) {
    this.dto = dto;
    this.builder = new UserBuilder(requestInfo);
  }

  async getUser(): Promise<UserEntity> {
    const { firstName, middleName, lastName, phone, email, profilePic, roleId, companyId } = this.dto;
    this.builder = this.builder
      .setFirstName(firstName)
      .setMiddleName(middleName)
      .setLastName(lastName)
      .setPartnerId(companyId)
      .setRealm('CUSTOMER')
      .setPhone(phone)
      .setEmail(email)
      .setRole(roleId)
      .setProfilePic(profilePic);
    this.builder = await this.builder.addUserAccesses(['WEB']);
    return this.builder.build();
  }
  getNotificationDetail(userId: number, channel?: Channel) {
    return this.builder.getNotificationDetail(userId, channel);
  }
}
