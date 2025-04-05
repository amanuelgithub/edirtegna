import { COMPANY_ADMIN, COMPANY_ROLE, CUSTOMER_ROLE } from '@app/db';
import { GroupEntity } from '@app/db/group';
import { CreateGroupDto, GroupPageConfigDto, UpdateGroupDto } from '@app/group/dtos';
import { GroupService } from '@app/group/services/group.service';
import { API_TAGS, ActivityTitle, ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery, Roles } from '@app/shared';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('/app/countries')
@Roles(...CUSTOMER_ROLE)
@ApiTags(API_TAGS.GROUP)
@ApiBearerAuth()
export class CustomerGroupController {
  constructor(private readonly service: GroupService) {}

  @Get('/')
  @ApiOkPaginatedResponse(GroupEntity, GroupPageConfigDto)
  @ApiPaginationQuery(GroupPageConfigDto)
  findAll(@Paginate() query: PaginateQuery) {
    return this.service.getAll(query);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}
