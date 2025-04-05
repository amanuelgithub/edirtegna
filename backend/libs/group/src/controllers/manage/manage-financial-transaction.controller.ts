import { COMPANY_ADMIN, COMPANY_ROLE } from '@app/db';
import { FinancialTransactionEntity } from '@app/db/group';
import { CreateFinancialTransactionDto, FinancialTransactionPageConfigDto, UpdateFinancialTransactionDto } from '@app/group/dtos';
import { FinancialTransactionService } from '@app/group/services/financial-transaction.service';
import { API_TAGS, ActivityTitle, ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery, Roles } from '@app/shared';
import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('/manage/financial-transactions')
@Roles(...COMPANY_ROLE)
@ApiTags(API_TAGS.PARAMETERS)
@ApiBearerAuth()
export class ManageFinancialTransactionController {
  constructor(private readonly service: FinancialTransactionService) {}

  @Get('/')
  @ApiOkPaginatedResponse(FinancialTransactionEntity, FinancialTransactionPageConfigDto)
  @ApiPaginationQuery(FinancialTransactionPageConfigDto)
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
  @ActivityTitle('Create Financial Transaction')
  create(@Body() dto: CreateFinancialTransactionDto) {
    return this.service.create(dto);
  }

  @Put('/:id')
  @Roles(COMPANY_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Update Financial Transaction')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateFinancialTransactionDto) {
    return this.service.update(id, body);
  }
}
