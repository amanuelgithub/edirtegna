import { AUDIT_LOG_DATA } from '@app/shared';
import { SetMetadata } from '@nestjs/common';

export const AuditLog = (...value: string[]) => SetMetadata(AUDIT_LOG_DATA, value);
