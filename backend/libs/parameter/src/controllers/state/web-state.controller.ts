import { CUSTOMER_ROLE } from '@app/db';
import { StateEntity } from '@app/db/parameters';
import { StatePageConfigDto } from '@app/parameter/dtos';
import { StateService } from '@app/parameter/services/state.service';
import { API_TAGS, ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery, Roles } from '@app/shared';
import { Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('/web/states')
@Roles(...CUSTOMER_ROLE)
@ApiTags(API_TAGS.PARAMETERS)
@ApiBearerAuth()
export class CustomerStateController {
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
}
