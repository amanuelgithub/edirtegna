import { NestFactory } from '@nestjs/core';
import { JobModule } from './job.module';
import { Transport } from '@nestjs/microservices';
import { StringUtil } from '@app/shared';
import { Logger } from '@nestjs/common';
import { LoggerService } from '@app/logger';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(JobModule, {
    bufferLogs: true,
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST,
      username: 'default',
      port: StringUtil.parseInteger(process.env.REDIS_PORT, 6379),
      password: process.env.REDIS_PASSWORD,
    },
  });

  const logger = new Logger('Initialization');

  app.useLogger(app.get(LoggerService));
  app.flushLogs();

  await app.listen();
  logger.log(`SERVER JOBS PROCESSING QUEUE STARTED!`, `worker.bootstrap`);
}
bootstrap();
