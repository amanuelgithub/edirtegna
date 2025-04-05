import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { MembershipRequestService } from '../../services/membership-request.service';
import { CreateMembershipRequestDto, UpdateMembershipRequestDto } from '../../dtos/membership-request.dto';
import { PaginateQuery } from '@app/shared';

@Controller('app/membership-requests')
export class AppMembershipRequestController {
  constructor(private readonly membershipRequestService: MembershipRequestService) {}

  @Get()
  findAll(@Query() query: PaginateQuery) {
    return this.membershipRequestService.getAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membershipRequestService.findOne(+id);
  }

  @Post()
  create(@Body() createMembershipRequestDto: CreateMembershipRequestDto) {
    return this.membershipRequestService.create(createMembershipRequestDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMembershipRequestDto: UpdateMembershipRequestDto) {
    return this.membershipRequestService.update(+id, updateMembershipRequestDto);
  }
}
