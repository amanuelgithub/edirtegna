import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { TrpcRouter } from '@app/trpc/trpc.router';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  console.log('Listening API app....: ');

  app.enableCors();
  const trpc = app.get(TrpcRouter);
  trpc.applyMiddleware(app);

  await app.listen(process.env.port ?? 4000);
}
bootstrap();
