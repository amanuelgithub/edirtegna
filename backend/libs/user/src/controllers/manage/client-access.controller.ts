import { COMPANY_ROLE } from '@app/db';
import { API_TAGS, IRequestDetail, RequestInfo, Roles } from '@app/shared';
import { Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CleantAccessPageOptionsDto } from '../../dtos';
import { ClientAccessService } from '../../services';

@Controller('manage/clients')
@Roles(...COMPANY_ROLE)
@ApiTags(API_TAGS.USER_MANAGEMENT)
export class ManageClientAccessController {
  constructor(private clientAccessService: ClientAccessService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  getAll(@Query(new ValidationPipe({ transform: true })) dto: CleantAccessPageOptionsDto) {
    return this.clientAccessService.getClientAccesses(dto);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id', ParseIntPipe) id: number, @RequestInfo() info: IRequestDetail) {
    return this.clientAccessService.getClientAccessById({ id, userId: Number(info.user.uid) });
  }
}
