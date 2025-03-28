import { Module, forwardRef } from '@nestjs/common';

import { USER_ENTITIES } from '@app/db';
import { GlobalConfigModule } from '@app/global-config';
import { NotificationModule } from '@app/notification';
import { TypeOrmModule } from '@app/typeorm';
import {
  ActivityLogController,
  ClientController,
  ManageClientAccessController,
  ManageCompanyUserController,
  WebActivityLogController,
  WebCustomerUserController,
  WebUserCommonController,
} from './controllers';
import {
  ActivityLogService,
  ClientAccessService,
  CommonUserService,
  CreateUserService,
  GetUserService,
  ListUsersService,
  PhoneAndEmailValidationService,
  UpdateUserService,
} from './services';

const providers = [
  ActivityLogService,
  CommonUserService,
  CreateUserService,
  GetUserService,
  ListUsersService,
  PhoneAndEmailValidationService,
  UpdateUserService,
  ClientAccessService,
];
const controllers = [
  ActivityLogController,
  ManageCompanyUserController,
  WebActivityLogController,
  WebUserCommonController,
  ClientController,
  ManageClientAccessController,
  WebCustomerUserController,
];

@Module({
  imports: [forwardRef(() => GlobalConfigModule), forwardRef(() => NotificationModule), TypeOrmModule.forFeature(USER_ENTITIES)],
  controllers,
  providers,
  exports: [...providers],
})
export class UserModule {}
