import { COMPANY_ADMIN, COMPANY_ROLE } from '@app/db';
import { EventEntity } from '@app/db/group';
import { CreateEventDto, EventPageConfigDto, UpdateEventDto } from '@app/group/dtos';
import { EventService } from '@app/group/services/event.service';
import { API_TAGS, ActivityTitle, ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery, Roles } from '@app/shared';
import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('/manage/events')
@Roles(...COMPANY_ROLE)
@ApiTags(API_TAGS.PARAMETERS)
@ApiBearerAuth()
export class ManageEventController {
  constructor(private readonly service: EventService) {}

  @Get('/')
  @ApiOkPaginatedResponse(EventEntity, EventPageConfigDto)
  @ApiPaginationQuery(EventPageConfigDto)
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
  @ActivityTitle('Create Event')
  create(@Body() dto: CreateEventDto) {
    return this.service.create(dto);
  }

  @Put('/:id')
  @Roles(COMPANY_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Update Event')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateEventDto) {
    return this.service.update(id, body);
  }
}
