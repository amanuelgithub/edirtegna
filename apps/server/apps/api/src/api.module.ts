import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { UsersModule } from '@app/users';
import { TrpcModule } from '@app/trpc';

@Module({
  imports: [UsersModule, TrpcModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
