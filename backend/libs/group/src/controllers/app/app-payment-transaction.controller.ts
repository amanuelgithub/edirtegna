import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { PaymentTransactionService } from '../../services/payment-transaction.service';
import { CreatePaymentTransactionDto, UpdatePaymentTransactionDto } from '../../dtos/payment-transaction.dto';
import { PaginateQuery } from '@app/shared';

@Controller('app/payment-transactions')
export class AppPaymentTransactionController {
  constructor(private readonly paymentTransactionService: PaymentTransactionService) {}

  @Get()
  findAll(@Query() query: PaginateQuery) {
    return this.paymentTransactionService.getAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentTransactionService.findOne(+id);
  }

  @Post()
  create(@Body() createPaymentTransactionDto: CreatePaymentTransactionDto) {
    return this.paymentTransactionService.create(createPaymentTransactionDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentTransactionDto: UpdatePaymentTransactionDto) {
    return this.paymentTransactionService.update(+id, updatePaymentTransactionDto);
  }
}
