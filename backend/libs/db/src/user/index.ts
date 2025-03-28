import { AccessDeviceEntity } from './access-device.entity';
import { ActivityLogEntity } from './activity-log.entity';
import { RoleEntity } from './role.entity';
import { UserAccessEntity } from './user-access.entity';
import { UserProfileEntity } from './user-profile.entity';
import { UserEntity } from './user.entity';

export * from './access-device.entity';
export * from './activity-log.entity';
export * from './role.entity';
export * from './user-access.entity';
export * from './user-profile.entity';
export * from './user.entity';

export const USER_ENTITIES = [AccessDeviceEntity, ActivityLogEntity, RoleEntity, UserAccessEntity, UserProfileEntity, UserEntity];
