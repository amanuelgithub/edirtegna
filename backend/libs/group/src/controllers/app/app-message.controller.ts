import { CUSTOMER_ROLE } from '@app/db';
import { MessageEntity } from '@app/db/group';
import { CreateMessageDto, MessagePageConfigDto, UpdateMessageDto } from '@app/group/dtos';
import { MessageService } from '@app/group/services/message.service';
import { API_TAGS, ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery, Roles } from '@app/shared';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('/app/messages')
@Roles(...CUSTOMER_ROLE)
@ApiTags(API_TAGS.GROUP)
@ApiBearerAuth()
export class AppMessageController {
  constructor(private readonly service: MessageService) {}

  @Get('/')
  @ApiOkPaginatedResponse(MessageEntity, MessagePageConfigDto)
  @ApiPaginationQuery(MessagePageConfigDto)
  findAll(@Paginate() query: PaginateQuery) {
    return this.service.getAll(query);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}
