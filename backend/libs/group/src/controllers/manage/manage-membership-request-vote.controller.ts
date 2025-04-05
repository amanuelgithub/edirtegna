import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { MembershipRequestVoteService } from '../../services/membership-request-vote.service';
import { CreateMembershipRequestVoteDto, UpdateMembershipRequestVoteDto } from '../../dtos/membership-request-vote.dto';
import { PaginateQuery } from '@app/shared';

@Controller('manage/membership-request-votes')
export class ManageMembershipRequestVoteController {
  constructor(private readonly membershipRequestVoteService: MembershipRequestVoteService) {}

  @Get()
  findAll(@Query() query: PaginateQuery) {
    return this.membershipRequestVoteService.getAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membershipRequestVoteService.findOne(+id);
  }

  @Post()
  create(@Body() createMembershipRequestVoteDto: CreateMembershipRequestVoteDto) {
    return this.membershipRequestVoteService.create(createMembershipRequestVoteDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMembershipRequestVoteDto: UpdateMembershipRequestVoteDto) {
    return this.membershipRequestVoteService.update(+id, updateMembershipRequestVoteDto);
  }
}
