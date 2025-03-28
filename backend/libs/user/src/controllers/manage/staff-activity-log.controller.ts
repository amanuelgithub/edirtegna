import { ActivityLogEntity, ROLE } from '@app/db';
import { API_TAGS, ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, Paginated, PaginateQuery, Roles } from '@app/shared';
import { Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActivityLogPageConfig } from '../../dtos';
import { ActivityLogService } from '../../services';

@Controller('manage/activity-logs')
@Roles(...ROLE)
@ApiTags(API_TAGS.USER_MANAGEMENT)
export class ActivityLogController {
  constructor(private service: ActivityLogService) {}

  @Get('/')
  @ApiOkPaginatedResponse(ActivityLogEntity, ActivityLogPageConfig)
  @ApiPaginationQuery(ActivityLogPageConfig)
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<ActivityLogEntity>> {
    return this.service.getAllActivityLogs(query);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.getActivityLogById({ id });
  }
}
