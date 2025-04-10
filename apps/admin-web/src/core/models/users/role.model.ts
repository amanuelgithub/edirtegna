import { Realm } from '@/core/enums';
import { User } from './user.model';

export interface Role {
  name: string;
  realm: Realm;
  description?: string;
  users?: User[];
}
