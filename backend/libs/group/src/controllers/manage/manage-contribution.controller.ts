import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { ContributionService } from '../../services/contribution.service';
import { CreateContributionDto, UpdateContributionDto } from '../../dtos/contribution.dto';
import { PaginateQuery } from '@app/shared';

@Controller('manage/contributions')
export class ManageContributionController {
  constructor(private readonly contributionService: ContributionService) {}

  @Get()
  findAll(@Query() query: PaginateQuery) {
    return this.contributionService.getAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contributionService.findOne(+id);
  }

  @Post()
  create(@Body() createContributionDto: CreateContributionDto) {
    return this.contributionService.create(createContributionDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContributionDto: UpdateContributionDto) {
    return this.contributionService.update(+id, updateContributionDto);
  }
}
