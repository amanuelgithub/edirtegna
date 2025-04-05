import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { EmergencyRequestService } from '../../services/emergency-request.service';
import { CreateEmergencyRequestDto, UpdateEmergencyRequestDto } from '../../dtos/emergency-request.dto';
import { PaginateQuery } from '@app/shared';

@Controller('manage/emergency-requests')
export class ManageEmergencyRequestController {
  constructor(private readonly emergencyRequestService: EmergencyRequestService) {}

  @Get()
  findAll(@Query() query: PaginateQuery) {
    return this.emergencyRequestService.getAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emergencyRequestService.findOne(+id);
  }

  @Post()
  create(@Body() createEmergencyRequestDto: CreateEmergencyRequestDto) {
    return this.emergencyRequestService.create(createEmergencyRequestDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmergencyRequestDto: UpdateEmergencyRequestDto) {
    return this.emergencyRequestService.update(+id, updateEmergencyRequestDto);
  }
}
