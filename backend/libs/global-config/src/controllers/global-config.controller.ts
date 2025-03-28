import { COMPANY_ADMIN } from '@app/db';
import { ActivityTitle, API_TAGS, Roles } from '@app/shared';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthConfigDto, ChunkSizeConfigDto, GeneralConfigDto, NotificationConfigDto } from '../dto';
import { GlobalConfigService } from '../services';

@Controller('global-configs')
@Roles(COMPANY_ADMIN)
@ApiTags(API_TAGS.GLOBAL_CONFIG)
export class GlobalConfigController {
  constructor(private service: GlobalConfigService) {}
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllGlobalConfigs() {
    return this.service.getConfigs();
  }

  @Post('/general-config')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Update General Config')
  saveGeneralConfig(@Body() dto: GeneralConfigDto) {
    return this.service.saveConfig<GeneralConfigDto>('general', dto);
  }
  @Post('/notification-config')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Update Notification Config')
  saveNotificationConfig(@Body() dto: NotificationConfigDto) {
    return this.service.saveConfig<NotificationConfigDto>('notification', dto);
  }
  @Post('/auth-config')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Update Authentication Config')
  saveAuthConfig(@Body() dto: AuthConfigDto) {
    return this.service.saveConfig<AuthConfigDto>('auth', dto);
  }
  @Post('/chunk-size-config')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Update Chunk Size Config')
  saveChunkSizeConfig(@Body() dto: ChunkSizeConfigDto) {
    return this.service.saveConfig<ChunkSizeConfigDto>('chunkSize', dto);
  }
}
