import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '@app/shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  @Public()
  getHello() {
    return this.appService.seedData();
  }
}
