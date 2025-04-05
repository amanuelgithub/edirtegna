import { CUSTOMER_ROLE } from '@app/db';
import { GroupMembershipEntity } from '@app/db/group';
import { CreateGroupMembershipDto, GroupMembershipPageConfigDto, UpdateGroupMembershipDto } from '@app/group/dtos';
import { GroupMembershipService } from '@app/group/services/group-membership.service';
import { API_TAGS, ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery, Roles } from '@app/shared';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('/app/group-memberships')
@Roles(...CUSTOMER_ROLE)
@ApiTags(API_TAGS.GROUP)
@ApiBearerAuth()
export class AppGroupMembershipController {
  constructor(private readonly service: GroupMembershipService) {}

  @Get('/')
  @ApiOkPaginatedResponse(GroupMembershipEntity, GroupMembershipPageConfigDto)
  @ApiPaginationQuery(GroupMembershipPageConfigDto)
  findAll(@Paginate() query: PaginateQuery) {
    return this.service.getAll(query);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}
