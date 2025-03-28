import { CUSTOMER_ROLE } from '@app/db';
import { API_TAGS, IRequestDetail, RequestInfo, Roles } from '@app/shared';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CleantAccessPageOptionsDto, CreateClientAccessDto, UpdateClientAccessDto } from '../dtos';
import { ClientAccessService } from '../services';

@Controller('web/clients')
@Roles(...CUSTOMER_ROLE)
@ApiTags(API_TAGS.USER_MANAGEMENT)
export class ClientController {
  constructor(private service: ClientAccessService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  getAll(@Query(new ValidationPipe({ transform: true })) dto: CleantAccessPageOptionsDto, @RequestInfo() info: IRequestDetail) {
    dto.userId = Number(info.user.uid);
    return this.service.getClientAccesses(dto);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  get(@Param('id', ParseIntPipe) id: number, @RequestInfo() info: IRequestDetail) {
    return this.service.getClientAccessById({ id, userId: Number(info.user.uid) });
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  create(@Body() dto: CreateClientAccessDto, @RequestInfo() info: IRequestDetail) {
    const userId = Number(info.user.uid);

    return this.service.createClientAccess({ ...dto, userId });
  }

  @Put('/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(ValidationPipe)
  update(@Param('id', ParseIntPipe) id: number, @RequestInfo() info: IRequestDetail, @Body() dto: UpdateClientAccessDto) {
    return this.service.updateClientAccess({ ...dto, userId: Number(info.user.uid) }, id);
  }
}
