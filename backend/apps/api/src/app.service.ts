import { ROLES_SEED, RoleEntity } from '@app/db';
import { Realm } from '@app/shared';
import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private ds: DataSource) {}

  async seedData() {
    const result = {};
    Logger.log('Running system data initialization...');
    result['Roles'] = await this.initRoles();
    Logger.log('System data initialization Completed.');
    return result;
  }

  private async initRoles() {
    const initialCount = await this.ds.getRepository(RoleEntity).count();
    if (initialCount === 0) {
      const data: RoleEntity[] = [];
      for (let i = 0; i < ROLES_SEED.length; i++) {
        const o = ROLES_SEED[i];
        data.push(new RoleEntity({ ...o, realm: o.realm as Realm }));
      }
      await this.ds.getRepository(RoleEntity).insert(data);
    }
    const finalCount = await this.ds.getRepository(RoleEntity).count();
    Logger.log(`Roles: [Initial Count = ${initialCount}, Final Count: ${finalCount}]`);
    return { initialCount, finalCount };
  }
}
