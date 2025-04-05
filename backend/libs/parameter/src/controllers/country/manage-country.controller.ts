import { COMPANY_ADMIN, COMPANY_ROLE } from '@app/db';
import { CountryEntity } from '@app/db/parameters';
import { CreateCountryDto, CountryPageConfigDto, UpdateCountryDto } from '@app/parameter/dtos';
import { CountryService } from '@app/parameter/services/country.service';
import { API_TAGS, ActivityTitle, ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery, Roles } from '@app/shared';
import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('/manage/countries')
@Roles(...COMPANY_ROLE)
@ApiTags(API_TAGS.PARAMETERS)
@ApiBearerAuth()
export class ManageCountryController {
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

  @Post('/')
  @Roles(COMPANY_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Create Country')
  create(@Body() dto: CreateCountryDto) {
    return this.service.create(dto);
  }

  @Put('/:id')
  @Roles(COMPANY_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Create Country')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateCountryDto) {
    return this.service.update(id, body);
  }
}
