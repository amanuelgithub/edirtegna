import { UserEntity } from '@app/db';
import { Realm } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { EntityManager, Not } from 'typeorm';

@Injectable()
export class CommonUserService {
  public async isEmailAlreadyUsed(m: EntityManager, realm: Realm, email: string, userId?: number): Promise<boolean | undefined> {
    if (!email) return false;
    const where = { realm, email };
    if (userId) {
      where['id'] = Not(userId);
    }
    const count = await m.count(UserEntity, { where });
    return count > 0;
  }
  public async isPhoneAlreadyUsed(m: EntityManager, realm: Realm, phone: string, userId?: number): Promise<boolean | undefined> {
    const where = { realm, phone };
    if (userId) {
      where['id'] = Not(userId);
    }
    const count = await m.count(UserEntity, { where });
    return count > 0;
  }
}
