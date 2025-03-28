import { UserEntity, UserProfileEntity } from '@app/db';
import { IAccountSMS } from '@app/notification';
// import { IProductList } from '@app/product/dtos';
import { Channel, IRequestDetail, IsValidMsisdn, Realm, StringUtil, UserStatus, getPhoneFormatNational } from '@app/shared';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ICredentials } from '../interfaces';
// import { CustomerProductPriceBuilder } from './customer-product-price.builder';
// import { CustomerProfileBuilder, ICustomerProfileOpts } from './customer-profile.builder';
import { UserAccessBuilder } from './user-access.builder';

export class UserBuilder {
  private user: UserEntity;
  private requestInfo: IRequestDetail;
  private credentials: ICredentials[];

  constructor(requestInfo: IRequestDetail) {
    this.credentials = [];
    this.requestInfo = requestInfo;
    this.user = new UserEntity({
      idpId: uuidv4(),
      realm: this.requestInfo.realm,
      createdBy: this.requestInfo?.user?.uid,
      status: 'PENDING',
      // registrationProvider: 'LOCAL',
      userAccesses: [],
      userProfile: new UserProfileEntity({}),
    });
  }

  setFirstName(value: string): this {
    this.user.userProfile.firstName = StringUtil.toTitleCase(value);
    return this;
  }

  setMiddleName(value: string): this {
    this.user.userProfile.middleName = StringUtil.toTitleCase(value);
    return this;
  }

  setLastName(value: string): this {
    this.user.userProfile.lastName = StringUtil.toTitleCase(value);
    return this;
  }

  // setUserName(value: string): this {
  //   this.user.userName = StringUtil.toTitleCase(value);
  //   return this;
  // }

  setNationalId(value: string): this {
    this.user.userProfile.nationalId = value;
    return this;
  }
  setAddress(value: string): this {
    this.user.userProfile.address = value;
    return this;
  }

  setPartnerId(value: number): this {
    //this.user.userProfile.partnerId = value;
    return this;
  }

  setProfilePic(value: string): this {
    this.user.userProfile.profilePic = value;
    return this;
  }
  // setDob(value: Date): this {
  //   this.user.userProfile.dob = value;
  //   return this;
  // }
  // setCityId(value: number): this {
  //   this.user.userProfile.cityId = value;
  //   return this;
  // }
  // setStateId(value: number): this {
  //   this.user.userProfile.stateId = value;
  //   return this;
  // }
  // setCountryId(value: number): this {
  //   this.user.userProfile.countryId = value;
  //   return this;
  // }

  setPhone(phone: string): this {
    if (phone) {
      if (!new IsValidMsisdn().validate(phone?.trim())) {
        throw new BadRequestException(`The value '${phone}' is not valid for the field 'phone'`);
      }
      this.user.phone = getPhoneFormatNational(phone?.trim());
    }
    return this;
  }
  // setPhoneX(phone: string): this {
  //   this.user.phone = phone;
  //   return this;
  // }
  setEmail(value: string): this {
    if (value) this.user.email = value ? value : null;
    return this;
  }
  setRole(value: number): this {
    this.user.roleId = value;
    return this;
  }
  setRealm(value: Realm): this {
    this.user.realm = value;
    return this;
  }
  setParent(value: UserEntity): this {
    if (!value) {
      throw new BadRequestException('Registration Requires valid parent');
    }
    // this.user.parentUserId = value.id;
    return this;
  }
  // setAccessChannels(value: Channel[]): this {
  //   this.user.accessChannels = value;
  //   return this;
  // }
  // setCustomerProfile(opts: ICustomerProfileOpts): this {
  //   this.user.customerProfile = new CustomerProfileBuilder()
  //     .setCanCreateSubAccounts(opts.canCreateSubAccounts)
  //     .setShareParentWallet(opts.shareParentWallet)
  //     .setMaxDailyWalletThreshold(opts.maximumDailyWalletThreshold)
  //     .setWalletAlertThreshold(opts.walletAlertThreshold)
  //     .build();
  //   return this;
  // }
  setStatus(value: UserStatus): this {
    this.user.status = value;
    return this;
  }
  // setSocialProfileId(value: string): this {
  //   this.user.socialProfileId = value;
  //   return this;
  // }
  // setRegistrationProvider(value: RegistrationProvider): this {
  //   this.user.registrationProvider = value;
  //   return this;
  // }

  // setProductPriceList(opts: IProductList[]): this {
  //   this.user.productPrices = [];
  //   for (let i = 0; i < opts?.length; i++) {
  //     const opt = opts[i];
  //     const { product, purchaseTransactionFee, purchaseUnitPrice, salesTransactionFee, salesProfitMarginRate, parentPrice } = opt;
  //     // eslint-disable-next-line prettier/prettier
  //     this.user.productPrices.push(
  //       new CustomerProductPriceBuilder(product, parentPrice)
  //         .setIsActive(true)
  //         .setPriceType('CUSTOMER_PRICE')
  //         .setPurchaseUnitPrice(purchaseUnitPrice)
  //         .setPurchaseTransactionFee(purchaseTransactionFee)
  //         .setSalesProfitMarginRate(salesProfitMarginRate)
  //         .setSalesTransactionFeeRate(salesTransactionFee)
  //         .build(),
  //     );
  //   }
  //   return this;
  // }
  // setupWallet(currencyId: number): this {
  //   this.user.wallet = new WalletEntity({ walletType: 'MAIN', currencyId });
  //   this.user.commissionWallet = new WalletEntity({ walletType: 'COMMISSION', currencyId });
  //   return this;
  // }

  async addUserAccesses(channels: ('WEB' | 'APP')[]): Promise<this> {
    for (let i = 0; i < channels.length; i++) {
      const channel = channels[i] as 'WEB' | 'APP';
      const uaBuilder = new UserAccessBuilder(channel);
      const userAccess = await uaBuilder.build();
      this.user.userAccesses.push(userAccess);
      this.credentials.push(uaBuilder.getCredentials());
    }
    return this;
  }

  build(): UserEntity {
    const { /* registrationProvider, socialProfileId, */ phone, email } = this.user;
    // if (registrationProvider !== 'LOCAL' && !socialProfileId) {
    //   throw new BadRequestException(`Registrtion requires a valid ${registrationProvider} profileId`);
    // }
    if (!phone && !email) {
      throw new BadRequestException(`Registrtion requires a valid phone or email`);
    }

    return this.user;
  }
  getNotificationDetail(userId: number, channel?: Channel): IAccountSMS {
    const _channel = channel || this.requestInfo.channel;
    const _channelName = StringUtil.toTitleCase(_channel);
    const _credential = this.credentials.find((o) => o.channel === _channel);
    // const _credential = this.credentials[0];
    return {
      name: this.user?.userProfile?.firstName,
      destination: this.user.phone,
      msg: `your account registration is successful!\nYour ${_channelName} access detail is:`,
      subject: `OTP_VERIFICATION`,
      otpCode: _credential.otpCode,
      pinCode: _credential.pinCode ?? null,
      password: _credential.password ?? null,
      userId,
    };
  }
}
