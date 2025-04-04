import { GLOBAL_CONFIG_ENTITIES } from './global-config';
import { NOTIFICATION_ENTITIES } from './notification';
import { PARAMETER_ENTITIES } from './parameters';
import { USER_ENTITIES } from './user';
import { GROUP_ENTITIES } from './group';

export * from './_seed';
export * from './user';
export * from './notification';
export * from './global-config';
export * from './parameters';
export * from './group';

export const ENTITIES = [...USER_ENTITIES, ...NOTIFICATION_ENTITIES, ...GLOBAL_CONFIG_ENTITIES, ...PARAMETER_ENTITIES, ...GROUP_ENTITIES];
