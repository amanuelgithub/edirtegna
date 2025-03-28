import { PARTNER_ADMIN, PARTNER_CUSTOMER_SERVICE } from '@app/db';
import { IRequestInfo } from '@app/shared';
import { IUserBuilder } from './interfaces';
import { PartnerBuilder } from './partners.builder';
import { RegisterPartnerUserDto } from './request-dtos';

export * from './base';
export * from './interfaces';
export * from './request-dtos';
// builders
export * from './admins.builder';
export * from './partners.builder';

// Builders Factory

export class CustomerFactory {
  public static get<T extends { role: number }>(dto: T, requestInfo: IRequestInfo): IUserBuilder {
    const { role, ..._dto } = dto;
    switch (role) {
      case PARTNER_ADMIN:
        return new PartnerBuilder(_dto as unknown as RegisterPartnerUserDto, requestInfo);
      case PARTNER_CUSTOMER_SERVICE:
        return new PartnerBuilder(_dto as unknown as RegisterPartnerUserDto, requestInfo);
      // return new MerchantBuilder(_dto as unknown as RegisterMerchantDto, requestInfo);
      default:
        throw new Error('Invalid Partner Role / Role Not Supported');
    }
  }
}
