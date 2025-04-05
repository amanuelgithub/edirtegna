import { COMPANY_ADMIN, COMPANY_ROLE } from '@app/db';
import { CityEntity } from '@app/db/parameters';
import { CreateCityDto, CityPageConfigDto, UpdateCityDto } from '@app/parameter/dtos';
import { CityService } from '@app/parameter/services/city.service';
import { API_TAGS, ActivityTitle, ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery, Roles } from '@app/shared';
import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('/manage/cities')
@Roles(...COMPANY_ROLE)
@ApiTags(API_TAGS.PARAMETERS)
@ApiBearerAuth()
export class ManageCityController {
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

  @Post('/')
  @Roles(COMPANY_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Create City')
  create(@Body() dto: CreateCityDto) {
    return this.service.create(dto);
  }

  @Put('/:id')
  @Roles(COMPANY_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Create City')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateCityDto) {
    return this.service.update(id, body);
  }
}
