import { Role } from '@app/db';
import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: Role[]) => {
  return SetMetadata('roles', roles);
};
