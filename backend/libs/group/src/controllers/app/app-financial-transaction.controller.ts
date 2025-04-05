import { CUSTOMER_ROLE } from '@app/db';
import { FinancialTransactionEntity } from '@app/db/group';
import { CreateFinancialTransactionDto, FinancialTransactionPageConfigDto, UpdateFinancialTransactionDto } from '@app/group/dtos';
import { FinancialTransactionService } from '@app/group/services/financial-transaction.service';
import { API_TAGS, ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery, Roles } from '@app/shared';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('/app/financial-transactions')
@Roles(...CUSTOMER_ROLE)
@ApiTags(API_TAGS.GROUP)
@ApiBearerAuth()
export class AppFinancialTransactionController {
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
}
