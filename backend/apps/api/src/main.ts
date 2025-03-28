import { AppUtil } from '@app/shared';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import Decimal from 'decimal.js';
import { AppModule } from './app.module';
const logger = new Logger('Bootstrap');

async function bootstrap() {
  Decimal.set({ rounding: 5 });
  const app = await NestFactory.create(AppModule, { bufferLogs: true, bodyParser: false });
  const { port, host, address } = await AppUtil.initialize(app);
  await app.listen(port);
  logger.log(`Listening on-: ${address}`);
}

bootstrap().catch((err) => {
  logger.error(err);
  process.exit(1);
});
