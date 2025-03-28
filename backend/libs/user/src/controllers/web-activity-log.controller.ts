import { CUSTOMER_ROLE } from '@app/db';
import { API_TAGS, IRequestDetail, RequestInfo, Roles } from '@app/shared';
import { Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActivityLogPageOptionsDto } from '../dtos';
import { ActivityLogService } from '../services';
@Roles(...CUSTOMER_ROLE)
@Controller('web/activity-logs')
@ApiTags(API_TAGS.USER_MANAGEMENT)
export class WebActivityLogController {
  constructor(private service: ActivityLogService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  getAll(@Query(new ValidationPipe({ transform: true })) dto: ActivityLogPageOptionsDto, @RequestInfo() info: IRequestDetail) {
    dto.userId = +info.user?.uid;
    dto.partnerId = +info.user?.coid;
    return this.service.getActivityLogs(dto);
  }
  @Get('/users/:childUserId')
  @HttpCode(HttpStatus.OK)
  getForUser(
    @Param('childUserId', ParseIntPipe) childUserId: number,
    @Query(new ValidationPipe({ transform: true })) dto: ActivityLogPageOptionsDto,
    @RequestInfo() info: IRequestDetail,
  ) {
    dto.userId = childUserId;
    dto.parentUserId = +info.user?.uid;
    return this.service.getActivityLogs(dto);
  }

  @Get('/:id/users/:childUserId')
  @HttpCode(HttpStatus.OK)
  getForChildUser(@Param('childUserId', ParseIntPipe) childUserId: number, @Param('id', ParseIntPipe) id: number, @RequestInfo() info: IRequestDetail) {
    const dto = { id, parentUserId: +info.user?.uid, userId: childUserId };
    return this.service.getActivityLogById(dto);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id', ParseIntPipe) id: number, @RequestInfo() info: IRequestDetail) {
    const dto = { id, userId: +info.user?.uid };
    return this.service.getActivityLogById(dto);
  }
}
