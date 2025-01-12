import { Controller, Get } from '@nestjs/common';
import { JobService } from './job.service';

@Controller()
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  getHello(): string {
    return this.jobService.getHello();
  }
}
