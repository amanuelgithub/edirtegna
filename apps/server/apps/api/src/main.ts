import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  console.log('Listening API app....: ');
  await app.listen(process.env.port ?? 4000);
}
bootstrap();
