import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { MemberRelativeService } from '../../services/member-relative.service';
import { CreateMemberRelativeDto, UpdateMemberRelativeDto } from '../../dtos/member-relative.dto';
import { PaginateQuery } from '@app/shared';

@Controller('manage/member-relatives')
export class ManageMemberRelativeController {
  constructor(private readonly memberRelativeService: MemberRelativeService) {}

  @Get()
  findAll(@Query() query: PaginateQuery) {
    return this.memberRelativeService.getAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.memberRelativeService.findOne(+id);
  }

  @Post()
  create(@Body() createMemberRelativeDto: CreateMemberRelativeDto) {
    return this.memberRelativeService.create(createMemberRelativeDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberRelativeDto: UpdateMemberRelativeDto) {
    return this.memberRelativeService.update(+id, updateMemberRelativeDto);
  }
}
