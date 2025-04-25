import { CUSTOMER, UserEntity } from '@app/db';
import { Channel, IRequestInfo, REGISTRATION_PROVIDER } from '@app/shared';
import { BadRequestException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserBuilder } from './base';
import { IUserBuilder } from './interfaces';
import { RegisterCustomerDto } from './request-dtos';

export class CustomerBuilder implements IUserBuilder {
  private builder: UserBuilder;
  constructor(private dto: RegisterCustomerDto, requestInfo: IRequestInfo) {
    this.builder = new UserBuilder(requestInfo);
  }

  // ------------------
  // PUBLIC
  // ------------------

  async getUser(m: EntityManager): Promise<UserEntity> {
    if (!m) {
      throw new BadRequestException('Entity Manager Required');
    }
    const { firstName, middleName, lastName, phone, email, profilePic } = this.dto;

    this.builder = this.builder
      .setFirstName(firstName)
      .setMiddleName(middleName)
      .setLastName(lastName)
      .setPhone(phone)
      .setEmail(email)
      .setRole(CUSTOMER)
      .setRealm('CUSTOMER')
      .setProfilePic(profilePic)
      .setRegistrationProvider(REGISTRATION_PROVIDER.LOCAL);
    // .setAccessChannels(['APP']);
    // .setupWallet(currencyId)
    // .setCustomerProfile({ canCreateSubAccounts, maximumDailyWalletThreshold, shareParentWallet, walletAlertThreshold })
    // .setProductPriceList(priceList);
    this.builder = await this.builder.addUserAccesses(['WEB']);
    const user = this.builder.build();
    return user;
  }

  getNotificationDetail(userId: number) {
    return this.builder.getNotificationDetail(userId);
  }
}
