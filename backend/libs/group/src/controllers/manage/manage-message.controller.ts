import { COMPANY_ADMIN, COMPANY_ROLE } from '@app/db';
import { MessageEntity } from '@app/db/group';
import { CreateMessageDto, MessagePageConfigDto, UpdateMessageDto } from '@app/group/dtos';
import { MessageService } from '@app/group/services/message.service';
import { API_TAGS, ActivityTitle, ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery, Roles } from '@app/shared';
import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('/manage/messages')
@Roles(...COMPANY_ROLE)
@ApiTags(API_TAGS.PARAMETERS)
@ApiBearerAuth()
export class ManageMessageController {
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

  @Post('/')
  @Roles(COMPANY_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Create Message')
  create(@Body() dto: CreateMessageDto) {
    return this.service.create(dto);
  }

  @Put('/:id')
  @Roles(COMPANY_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Update Message')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateMessageDto) {
    return this.service.update(id, body);
  }
}
