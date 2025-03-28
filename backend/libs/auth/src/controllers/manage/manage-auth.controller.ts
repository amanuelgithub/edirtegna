import { COMPANY_ADMIN } from '@app/db';
import { API_TAGS, Public, Roles } from '@app/shared';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AppThrottlerGuard } from '../../guards';
import { AuthWebService } from '../../services';

@Controller('manage/auth')
@Roles(COMPANY_ADMIN)
@ApiTags(API_TAGS.AUTHENTICATION)
@ApiBearerAuth()
export class ManageAuthWebController {
  constructor(private readonly authWebService: AuthWebService) {}

  @Public()
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @UseGuards(AppThrottlerGuard)
  @Get('/initialize')
  initializeRoot() {
    /* 
      curl http://localhost:3000/api/manage/auth/initialize
      curl https://api.voucher.et/api/v1/manage/auth/initialize
      */
    return this.authWebService.initializeRootUser();
    // return { status: 'ok' };
  }
}
