import { COMPANY_ADMIN, COMPANY_ROLE } from '@app/db';
import { StateEntity } from '@app/db/parameters';
import { CreateStateDto, StatePageConfigDto, UpdateStateDto } from '@app/parameter/dtos';
import { StateService } from '@app/parameter/services';
import { API_TAGS, ActivityTitle, ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery, Roles } from '@app/shared';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('/manage/states')
@Roles(...COMPANY_ROLE)
@ApiTags(API_TAGS.PARAMETERS)
@ApiBearerAuth()
export class ManageStateController {
  constructor(private readonly service: StateService) {}

  @Get('/')
  @ApiOkPaginatedResponse(StateEntity, StatePageConfigDto)
  @ApiPaginationQuery(StatePageConfigDto)
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
  @ActivityTitle('Create State')
  create(@Body() dto: CreateStateDto) {
    return this.service.create(dto);
  }

  @Put('/:id')
  @Roles(COMPANY_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Create State')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateStateDto) {
    return this.service.update(id, body);
  }
}
