import { CUSTOMER } from '@app/db';
import { IRequestInfo } from '@app/shared';
import { IUserBuilder } from './interfaces';
import { CustomerBuilder } from './customers.builder';
import { RegisterCustomerDto, RegisterPartnerUserDto } from './request-dtos';

export * from './base';
export * from './interfaces';
export * from './request-dtos';
// builders
export * from './admins.builder';
export * from './customers.builder';

// Builders Factory

export class CustomerFactory {
  public static get<T extends { role: number }>(dto: T, requestInfo: IRequestInfo): IUserBuilder {
    const { role, ..._dto } = dto;
    switch (role) {
      case CUSTOMER:
        return new CustomerBuilder(_dto as unknown as RegisterCustomerDto, requestInfo);
      // return new CustomerBuilder(_dto as unknown as RegisterPartnerUserDto, requestInfo);
      // case PARTNER_ADMIN:
      // return new PartnerBuilder(_dto as unknown as RegisterPartnerUserDto, requestInfo);
      // case PARTNER_CUSTOMER_SERVICE:
      //   return new PartnerBuilder(_dto as unknown as RegisterPartnerUserDto, requestInfo);
      // // return new MerchantBuilder(_dto as unknown as RegisterMerchantDto, requestInfo);
      default:
        throw new Error('Invalid Partner Role / Role Not Supported');
    }
  }
}
