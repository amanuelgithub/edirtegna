import { COMPANY_ADMIN, COMPANY_ROLE } from '@app/db';
import { GroupEntity } from '@app/db/group';
import { CreateGroupDto, GroupPageConfigDto, UpdateGroupDto } from '@app/group/dtos';
import { GroupService } from '@app/group/services/group.service';
import { API_TAGS, ActivityTitle, ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery, Roles } from '@app/shared';
import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('/manage/groups')
@Roles(...COMPANY_ROLE)
@ApiTags(API_TAGS.PARAMETERS)
@ApiBearerAuth()
export class ManageGroupController {
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

  @Post('/')
  @Roles(COMPANY_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Create Group')
  create(@Body() dto: CreateGroupDto) {
    return this.service.create(dto);
  }

  @Put('/:id')
  @Roles(COMPANY_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Create Group')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateGroupDto) {
    return this.service.update(id, body);
  }
}
