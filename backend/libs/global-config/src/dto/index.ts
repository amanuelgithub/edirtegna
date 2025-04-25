import { GlobalConfigEntity } from '@app/db';
import { BasePageOptionsDto } from '@app/shared';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export interface GlobalConfigAdapter {
  getConfigs(): GlobalConfigEntity;
}

export class AuthConfigDto implements GlobalConfigAdapter {
  getConfigs(): GlobalConfigEntity {
    return new GlobalConfigEntity({ key: 'auth', value: JSON.stringify(this) });
  }
  @IsNumber()
  @Type(() => Number)
  accessTokenLifespan: number; //'300';

  @IsNumber()
  @Type(() => Number)
  refreshTokenLifespan: number; //'3600';
  constructor(partial: Partial<AuthConfigDto>) {
    return Object.assign(this, partial);
  }
}

export class NotificationConfigDto implements GlobalConfigAdapter {
  getConfigs(): GlobalConfigEntity {
    return new GlobalConfigEntity({ key: 'notification', value: JSON.stringify(this) });
  }

  @IsBoolean()
  @Type(() => Boolean)
  isSmsNotificationInSimulation: boolean;

  @IsString({ each: true })
  smsNotificationSimulationDestinations: string[];

  @IsString({ each: true })
  companySmsAlertDestinations: string[];

  @IsBoolean()
  @Type(() => Boolean)
  sendSmsOnTelebirrApiFailure: boolean;

  @IsBoolean()
  @Type(() => Boolean)
  sendSmsOnAuditMismatchDetection: boolean;
  constructor(partial: Partial<NotificationConfigDto>) {
    return Object.assign(this, partial);
  }
}

export class GeneralConfigDto implements GlobalConfigAdapter {
  getConfigs(): GlobalConfigEntity {
    return new GlobalConfigEntity({ key: 'general', value: JSON.stringify(this) });
  }
  @IsBoolean()
  @Type(() => Boolean)
  enableApiRequestResponseLog: boolean;

  @IsString({ each: true })
  responseMethodsBodyToLog: string[];

  // @IsString()
  // @Type(() => String)
  // responseMethodsBodyToLog: string;

  @IsString({ each: true })
  requestMethodsBodyToLog: string[];

  @IsBoolean()
  @Type(() => Boolean)
  isTelebirrApiEnabled: boolean;

  @IsBoolean()
  @Type(() => Boolean)
  isSubRetailerForRetailersEnabled: boolean;

  @IsBoolean()
  @Type(() => Boolean)
  isYimuluApiEnabled: boolean;

  constructor(partial: Partial<GeneralConfigDto>) {
    return Object.assign(this, partial);
  }
}

export class ChunkSizeConfigDto implements GlobalConfigAdapter {
  getConfigs(): GlobalConfigEntity {
    return new GlobalConfigEntity({ key: 'chunkSize', value: JSON.stringify(this) });
  }
  @IsNumber()
  @Type(() => Number)
  chunkSize: number; //'300';

  constructor(partial: Partial<ChunkSizeConfigDto>) {
    return Object.assign(this, partial);
  }
}

export class SystemConfigDto {
  auth: AuthConfigDto;
  notification: NotificationConfigDto;
  general: GeneralConfigDto;
  chunkSize: ChunkSizeConfigDto;
}

// signRefreshToken
const FOURTEEN_DAYS_IN_SEC = 14 * 24 * 60 * 60;
const SIXTY_DAYS_SECONDS = 60 * 24 * 60 * 60;

const EXP_REF = process.env.NODE_ENV === 'production' ? SIXTY_DAYS_SECONDS : FOURTEEN_DAYS_IN_SEC;

// ACCESS
const TWO_MIN_SECONDS = 2 * 60;
const THIRTY_DAYS_SECONDS = 30 * 24 * 60 * 60;

const EXP_ACC = process.env.NODE_ENV === 'production' ? THIRTY_DAYS_SECONDS : TWO_MIN_SECONDS;
const ENABLE_API_LOG = !(process.env.NODE_ENV === 'production');

// INITIAL
const general = new GeneralConfigDto({
  enableApiRequestResponseLog: ENABLE_API_LOG,
  isTelebirrApiEnabled: true,
  isSubRetailerForRetailersEnabled: true,
  isYimuluApiEnabled: true,
  requestMethodsBodyToLog: ['POST', 'PUT'],
  responseMethodsBodyToLog: ['POST', 'PUT'],
});
const notification = new NotificationConfigDto({
  companySmsAlertDestinations: [`251963158999`],
  isSmsNotificationInSimulation: !(process.env.NODE_ENV === 'production'),
  sendSmsOnAuditMismatchDetection: true,
  sendSmsOnTelebirrApiFailure: true,
  smsNotificationSimulationDestinations: [`251963158999`],
});
const auth = new AuthConfigDto({ accessTokenLifespan: EXP_ACC, refreshTokenLifespan: EXP_REF });
const chunkSize = new ChunkSizeConfigDto({ chunkSize: 1000 });

export const CONFIG_INIT: SystemConfigDto = {
  general,
  notification,
  auth,
  chunkSize,
};
export class GlobalConfigDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}
export class GlobalConfigPageOptionsDto extends BasePageOptionsDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  key?: string;
}

export class CreateGlobalConfigDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}

export class UpdateGlobalConfigDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  key?: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  value?: string;
}
