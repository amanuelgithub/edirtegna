import { COMPANY_ADMIN, COMPANY_ROLE, CUSTOMER_ROLE } from '@app/db';
import { CountryEntity } from '@app/db/parameters';
import { CreateCountryDto, CountryPageConfigDto, UpdateCountryDto } from '@app/parameter/dtos';
import { CountryService } from '@app/parameter/services/country.service';
import { API_TAGS, ActivityTitle, ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery, Roles } from '@app/shared';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('/web/countries')
@Roles(...CUSTOMER_ROLE)
@ApiTags(API_TAGS.PARAMETERS)
@ApiBearerAuth()
export class CustomerCountryController {
  constructor(private readonly service: CountryService) {}

  @Get('/')
  @ApiOkPaginatedResponse(CountryEntity, CountryPageConfigDto)
  @ApiPaginationQuery(CountryPageConfigDto)
  findAll(@Paginate() query: PaginateQuery) {
    return this.service.getAll(query);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}
