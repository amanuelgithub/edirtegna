import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GROUP_ENTITIES } from '@app/db';

@Module({
  imports: [TypeOrmModule.forFeature(GROUP_ENTITIES)],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
