import { NestFactory } from '@nestjs/core';
import { JobModule } from './job.module';

async function bootstrap() {
  const app = await NestFactory.create(JobModule);
  console.log('Listening Job app....: ');
  await app.listen(process.env.port ?? 4001);
}
bootstrap();
