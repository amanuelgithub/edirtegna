import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { MemberRelativeAdditionRequestService } from '../../services/member-relative-addition-request.service';
import { CreateMemberRelativeAdditionRequestDto, UpdateMemberRelativeAdditionRequestDto } from '../../dtos/member-relative-addition-request.dto';
import { PaginateQuery } from '@app/shared';

@Controller('app/member-relative-addition-requests')
export class AppMemberRelativeAdditionRequestController {
  constructor(private readonly memberRelativeAdditionRequestService: MemberRelativeAdditionRequestService) {}

  @Get()
  findAll(@Query() query: PaginateQuery) {
    return this.memberRelativeAdditionRequestService.getAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.memberRelativeAdditionRequestService.findOne(+id);
  }

  @Post()
  create(@Body() createMemberRelativeAdditionRequestDto: CreateMemberRelativeAdditionRequestDto) {
    return this.memberRelativeAdditionRequestService.create(createMemberRelativeAdditionRequestDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberRelativeAdditionRequestDto: UpdateMemberRelativeAdditionRequestDto) {
    return this.memberRelativeAdditionRequestService.update(+id, updateMemberRelativeAdditionRequestDto);
  }
}
