import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { DigitalArchiveService } from '../../services/digital-archive.service';
import { CreateDigitalArchiveDto, UpdateDigitalArchiveDto } from '../../dtos/digital-archive.dto';
import { PaginateQuery } from '@app/shared';

@Controller('app/digital-archives')
export class AppDigitalArchiveController {
  constructor(private readonly digitalArchiveService: DigitalArchiveService) {}

  @Get()
  findAll(@Query() query: PaginateQuery) {
    return this.digitalArchiveService.getAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.digitalArchiveService.findOne(+id);
  }

  @Post()
  create(@Body() createDigitalArchiveDto: CreateDigitalArchiveDto) {
    return this.digitalArchiveService.create(createDigitalArchiveDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDigitalArchiveDto: UpdateDigitalArchiveDto) {
    return this.digitalArchiveService.update(+id, updateDigitalArchiveDto);
  }
}
