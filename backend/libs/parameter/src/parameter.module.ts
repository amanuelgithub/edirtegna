import { Module } from '@nestjs/common';
import { ParameterService } from './parameter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PARAMETER_ENTITIES } from '@app/db/parameters';

@Module({
  imports: [TypeOrmModule.forFeature(PARAMETER_ENTITIES)],
  providers: [ParameterService],
  exports: [ParameterService],
})
export class ParameterModule {}
