import { CUSTOMER_ROLE, NotificationEntity } from '@app/db';
import { API_TAGS, IRequestDetail, RequestInfo, Roles } from '@app/shared';
import { ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery, Paginated } from '@app/shared/paginate';
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationPageConfig } from '../dtos';
import { NotificationV2Service } from '../services';

@ApiTags(API_TAGS.NOTIFICATION)
@Controller('web/notifications')
@Roles(...CUSTOMER_ROLE)
export class WebNotificationController {
  constructor(private service: NotificationV2Service) {}

  @Get('/')
  @ApiOkPaginatedResponse(NotificationEntity, NotificationPageConfig)
  @ApiPaginationQuery(NotificationPageConfig)
  getAll(@Paginate() query: PaginateQuery, @RequestInfo() info: IRequestDetail): Promise<Paginated<NotificationEntity>> {
    const userId = +info?.user?.uid || null;
    return this.service.getAll(query, { userId });
  }

  @Get('/:id')
  // @Public()
  getOne(@Param('id', ParseIntPipe) id: number, @RequestInfo() info: IRequestDetail) {
    const userId = +info?.user?.uid || null;
    return this.service.getOneBy({ id, userId });
  }
}
/* 
import { DisputeNotificationEntity } from '@app/db';
import { ActivityTitle, CUSTOMER_ROLE, KeysOf, Roles, UploadFiles } from '@app/shared';
import { ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery, Paginated } from '@app/shared/paginate';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req, UploadedFiles, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateDisputeNotificationDto, DisputeNotificationPageConfig, UpdateDisputeNotificationDto } from '../dtos';
import { DisputeNotificationService } from '../services';

@ApiTags('3. Dispute Management')
@Controller('web/dispute-evidences')
@Roles(...KeysOf(CUSTOMER_ROLE))
export class WebDisputeNotificationController {
  constructor(private service: DisputeNotificationService) {}

  @Get('/')
  @ApiOkPaginatedResponse(DisputeNotificationEntity, DisputeNotificationPageConfig)
  @ApiPaginationQuery(DisputeNotificationPageConfig)
  getAll(@Paginate() query: PaginateQuery, @Req() req): Promise<Paginated<DisputeNotificationEntity>> {
    const userId = +req.user.uid;
    return this.service.getAll(query, { userId });
  }

  @Get('/:id')
  getOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = +req.user.uid;
    return this.service.getBy({ id, userId });
  }

  @Post('/')
  @ActivityTitle('Create DisputeNotification')
  @UsePipes(ValidationPipe)
  @UploadFiles({ documentType: 'dispute-evidence' })
  create(@UploadedFiles() files: Express.Multer.File[], @Body() dto: CreateDisputeNotificationDto, @Req() req) {
    dto.userId = +req.user.uid;
    dto.proofAttachments = files?.map((file) => file.filename);
    return this.service.create(dto);
  }

  @Put('update-files/:id')
  @UsePipes(ValidationPipe)
  @ActivityTitle('Update Notification Files')
  @UploadFiles({ documentType: 'dispute-evidence' })
  updateFiles(@UploadedFiles() files: Express.Multer.File[], @Param('id', ParseIntPipe) id: number, @Req() req) {
    const proofAttachments = files?.map((file) => file.filename);
    return this.service.update({ proofAttachments }, id, +req.user.uid);
  }

  @Put('/:id')
  @ActivityTitle('Update DisputeNotification')
  @UsePipes(ValidationPipe)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDisputeNotificationDto, @Req() req) {
    return this.service.update(dto, id, +req.user.uid);
  }
}

*/
