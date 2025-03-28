import { COMPANY_ADMIN, NotificationEntity } from '@app/db';
import { ActivityTitle, API_TAGS, DetailResponse, Public, Roles } from '@app/shared';
import { ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, Paginated, PaginateQuery } from '@app/shared/paginate';
import { Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationPageConfig } from '../dtos';
import { CommonNotificationService, NotificationService } from '../services';

@Controller('/notifications/')
@Roles(COMPANY_ADMIN)
@Public()
@ApiTags(API_TAGS.NOTIFICATION)
@ApiBearerAuth()
export class NotificationController {
  constructor(
    private notificationService: NotificationService,
    private commonNotificationService: CommonNotificationService,
  ) {}

  @Get('/')
  @ApiOkPaginatedResponse(NotificationEntity, NotificationPageConfig)
  @ApiPaginationQuery(NotificationPageConfig)
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<NotificationEntity>> {
    return this.notificationService.findAll(query);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<DetailResponse<NotificationEntity> | undefined> {
    console.log(await this.notificationService.getNotificationById(id));
    return this.notificationService.getNotificationById(id);
  }

  // Retry Notification - PUT /operators
  @Put('sms/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ActivityTitle('Retry SMS Notification')
  @UsePipes(ValidationPipe)
  retrySms(@Param('id', ParseIntPipe) id: number) {
    return this.commonNotificationService.retrySendingSMS(id);
  }
}
