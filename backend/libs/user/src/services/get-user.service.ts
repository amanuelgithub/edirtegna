import { Role, UserEntity } from '@app/db';
import { DetailResponse, Realm } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class GetUserService {
  constructor(private readonly ds: DataSource) {}

  public async getBy(opts: Partial<{ id: number; idpId: string; parentId: number; partnerId: number; role: Role }>): Promise<DetailResponse<UserEntity> | undefined> {
    const { id, idpId, parentId, role, partnerId } = opts;
    if (!id && !idpId && !parentId && !partnerId) return;
    const qb = this.ds.getRepository(UserEntity).createQueryBuilder('user');
    // qb.leftJoinAndSelect('user.parentUser', 'parentUser');
    qb.leftJoinAndSelect('user.userProfile', 'userProfile');
    // qb.leftJoinAndSelect('userProfile.partner', 'partner');
    qb.leftJoinAndSelect('user.role', 'role');

    if (id) {
      qb.andWhere('user.id = :id', { id });
    }
    if (idpId) {
      qb.andWhere('user.idpId = :idpId', { idpId });
    }
    if (parentId) {
      qb.andWhere('user.parentUserId = :parentId', { parentId });
    }
    if (partnerId) {
      qb.andWhere('userProfile.partnerId = :partnerId', { partnerId });
    }

    if (role) {
      qb.andWhere('user.roleId = :role', { role });
    }
    return new DetailResponse(await qb.getOne());
  }
  public async getByPhoneEmailAndRealm(m: EntityManager, realm: Realm, phone?: string, email?: string): Promise<UserEntity | undefined> {
    const where = phone ? { phone, realm } : { email, realm };
    return m.findOne(UserEntity, {
      where,
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          userAccesses: 'user.userAccesses',
          userProfile: 'user.userProfile',
          accessDevices: 'userAccesses.accessDevices',
        },
      },
    });
  }
  public async getByUserId(m: EntityManager, userId: number): Promise<UserEntity | undefined> {
    const where = { id: userId };
    return m.findOne(UserEntity, {
      where,
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          userAccesses: 'user.userAccesses',
          userProfile: 'user.userProfile',
          // partner: 'userProfile.partner',
          role: 'user.role',
          accessDevices: 'userAccesses.accessDevices',
        },
      },
    });
  }
}
