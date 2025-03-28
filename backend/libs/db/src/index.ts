import { GLOBAL_CONFIG_ENTITIES } from './global-config';
import { NOTIFICATION_ENTITIES } from './notification';
import { PARAMETER_ENTITIES } from './parameters';
import { USER_ENTITIES } from './user';

export * from './_seed';
export * from './user';
export * from './notification';
export * from './global-config';

export const ENTITIES = [...USER_ENTITIES, ...NOTIFICATION_ENTITIES, ...GLOBAL_CONFIG_ENTITIES, ...PARAMETER_ENTITIES];
