import { Injectable } from '@nestjs/common';

@Injectable()
export class JobService {
  getHello(): string {
    return 'Hello World!';
  }
}
