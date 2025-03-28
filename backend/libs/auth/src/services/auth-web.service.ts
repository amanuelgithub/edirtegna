import { COMPANY_ADMIN } from '@app/db';
import { UserNotificationService } from '@app/notification';
import { IRequestInfo } from '@app/shared';
import { AdministrativeUserBuilder, CreateUserService, RegisterAdminStaffDto } from '@app/user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthWebService {
  constructor(private readonly notify: UserNotificationService, private readonly createUserService: CreateUserService) {}
  public async initializeRootUser() {
    const dto: RegisterAdminStaffDto = {
      firstName: 'System Root',
      phone: '911756708',
      roleId: COMPANY_ADMIN,
      email: 'info@teleportet.com',
    };

    const requestInfo: IRequestInfo = { channel: 'WEB', ip: '127.0.0.1', realm: 'ADMIN' };
    const builder = new AdministrativeUserBuilder(dto, requestInfo);
    const user = await this.createUserService.createUser(builder);
    const smsPayload = builder.getNotificationDetail(user.id);
    await this.notify.sendAuthSMS(smsPayload);
    await this.notify.sendWelcomeEmail(user, smsPayload.otpCode, smsPayload.password);

    console.log('ADMIN CREATED: ', smsPayload);
    return user;
  }
}
