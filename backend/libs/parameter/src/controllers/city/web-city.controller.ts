import { COMPANY_ADMIN, COMPANY_ROLE, CUSTOMER_ROLE } from '@app/db';
import { CityEntity } from '@app/db/parameters';
import { CreateCityDto, CityPageConfigDto, UpdateCityDto } from '@app/parameter/dtos';
import { CityService } from '@app/parameter/services/city.service';
import { API_TAGS, ActivityTitle, ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery, Roles } from '@app/shared';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('/web/cities')
@Roles(...CUSTOMER_ROLE)
@ApiTags(API_TAGS.PARAMETERS)
@ApiBearerAuth()
export class CustomerCityController {
  constructor(private readonly service: CityService) {}

  @Get('/')
  @ApiOkPaginatedResponse(CityEntity, CityPageConfigDto)
  @ApiPaginationQuery(CityPageConfigDto)
  findAll(@Paginate() query: PaginateQuery) {
    return this.service.getAll(query);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}
