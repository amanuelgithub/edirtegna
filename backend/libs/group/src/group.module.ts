import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GROUP_ENTITIES } from '@app/db';
import { CustomerGroupController, ManageGroupController } from './controllers';
import { GroupService } from './services';

const controllers = [
  // app
  CustomerGroupController,
  // manage
  ManageGroupController,
];
const providers = [GroupService];

@Module({
  imports: [TypeOrmModule.forFeature(GROUP_ENTITIES)],
  providers: providers,
  controllers: controllers,
  exports: [],
})
export class GroupModule {}
