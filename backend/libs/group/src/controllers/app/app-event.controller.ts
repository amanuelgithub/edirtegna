import { CUSTOMER_ROLE } from '@app/db';
import { EventEntity } from '@app/db/group';
import { CreateEventDto, EventPageConfigDto, UpdateEventDto } from '@app/group/dtos';
import { EventService } from '@app/group/services/event.service';
import { API_TAGS, ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery, Roles } from '@app/shared';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('/app/events')
@Roles(...CUSTOMER_ROLE)
@ApiTags(API_TAGS.GROUP)
@ApiBearerAuth()
export class AppEventController {
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
}
