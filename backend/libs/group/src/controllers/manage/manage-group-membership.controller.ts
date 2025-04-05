import { COMPANY_ADMIN, COMPANY_ROLE } from '@app/db';
import { GroupMembershipEntity } from '@app/db/group';
import { CreateGroupMembershipDto, GroupMembershipPageConfigDto, UpdateGroupMembershipDto } from '@app/group/dtos';
import { GroupMembershipService } from '@app/group/services/group-membership.service';
import { API_TAGS, ActivityTitle, ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery, Roles } from '@app/shared';
import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('/manage/group-memberships')
@Roles(...COMPANY_ROLE)
@ApiTags(API_TAGS.PARAMETERS)
@ApiBearerAuth()
export class ManageGroupMembershipController {
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

  @Post('/')
  @Roles(COMPANY_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Create Group Membership')
  create(@Body() dto: CreateGroupMembershipDto) {
    return this.service.create(dto);
  }

  @Put('/:id')
  @Roles(COMPANY_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Update Group Membership')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateGroupMembershipDto) {
    return this.service.update(id, body);
  }
}
