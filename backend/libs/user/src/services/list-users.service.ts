import { UserEntity } from '@app/db';
import { PageDto, PageMetaDto, PaginateQuery, Paginated, USER_STATUS, getStartAndEndDates, normalizePhoneSearchTerm, paginate } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { UserPageConfig, UserPageOptionsDto } from '../dtos';
import { GetUserService } from '../services';
@Injectable()
export class ListUsersService {
  constructor(private readonly ds: DataSource, private getUserService: GetUserService) {}

  public async getUsersWebVersion(pageOptionsDto: UserPageOptionsDto): Promise<PageDto<UserEntity> | undefined> {
    const qb = this.ds.getRepository(UserEntity).createQueryBuilder('user');
    qb.leftJoinAndSelect('user.userProfile', 'userProfile');
    qb.leftJoinAndSelect('user.role', 'role');

    if (pageOptionsDto.idpId) {
      qb.andWhere('user.idpId = :idpId', { idpId: pageOptionsDto.idpId });
    }
    if (pageOptionsDto.roleId) {
      qb.andWhere('user.roleId = :roleId', { roleId: pageOptionsDto.roleId });
    }

    if (pageOptionsDto.email) {
      qb.andWhere('user.email LIKE :email', { email: `%${pageOptionsDto.email}%` });
    }
    if (pageOptionsDto.fullName) {
      qb.andWhere('userProfile.firstName LIKE :fullName', { fullName: `%${pageOptionsDto.fullName}%` });
    }
    if (pageOptionsDto.phone) {
      qb.andWhere('user.phone LIKE :phone', { phone: `%${normalizePhoneSearchTerm(pageOptionsDto.phone)}%` });
    }

    if (pageOptionsDto.phoneOrName) {
      const searchTerm = normalizePhoneSearchTerm(pageOptionsDto.phoneOrName);
      const phone = Number(searchTerm);
      if (isNaN(phone)) {
        qb.andWhere('userProfile.firstName LIKE :phoneOrName', { phoneOrName: `%${searchTerm}%` });
      } else {
        qb.andWhere('user.phone LIKE :phoneOrName', { phoneOrName: `%${searchTerm}%` });
      }
    }
    if (pageOptionsDto.createdAtRange) {
      const { start, end } = getStartAndEndDates(pageOptionsDto.createdAtRange);
      qb.andWhere('user.createdAt >= :start', { start });
      qb.andWhere('user.createdAt <= :end', { end });
    }

    if (typeof pageOptionsDto.parentCustomerId !== 'undefined') {
      qb.andWhere('user.parentUserId = :parentCustomerId', { parentCustomerId: pageOptionsDto.parentCustomerId });
    }
    if (pageOptionsDto.realm) {
      qb.andWhere('user.realm = :realm', { realm: pageOptionsDto.realm });
    }
    if (pageOptionsDto.fullName) {
      qb.andWhere('userProfile.firstName = :fullName', { fullName: pageOptionsDto.fullName });
    }
    if (pageOptionsDto.status) {
      qb.andWhere('user.status = :status', { status: `${USER_STATUS[pageOptionsDto.status]}` });
    }
    if (pageOptionsDto.roles) {
      const r = pageOptionsDto.roles.join("', '")?.toUpperCase();
      qb.andWhere(`role.name IN ('${r}')`);
    }
    if (pageOptionsDto.roleIds) {
      const r = pageOptionsDto.roleIds.join("', '")?.toUpperCase();
      qb.andWhere(`user.roleId IN ('${r}')`);
    }
    if (pageOptionsDto.role) {
      qb.andWhere('role.name = :role', { role: pageOptionsDto.role });
    }
    let sortStr = `user.${pageOptionsDto.sort || 'createdAt'}`;
    if (pageOptionsDto.sort === 'firstName') sortStr = `userProfile.${pageOptionsDto.sort}`;

    qb.orderBy(sortStr, pageOptionsDto.order);

    qb.skip((pageOptionsDto.page - 1) * pageOptionsDto.take).take(pageOptionsDto.take);
    const [users, usersCount] = await qb.getManyAndCount();
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount: usersCount });
    const data = await users.map((la) => la.toDto());
    return new PageDto(data, pageMetaDto);
  }

  public async getAll(query: PaginateQuery, where?: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[]): Promise<Paginated<UserEntity>> {
    return await paginate(query, this.ds.getRepository(UserEntity), { ...UserPageConfig, where });
  }

  public async getAllAgents(
    query: PaginateQuery,
    parentCustomerId: number,
    partnerId: number,
    where?: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
  ): Promise<Paginated<UserEntity>> {
    const qb = this.ds.getRepository(UserEntity).createQueryBuilder('user');
    qb.leftJoinAndSelect('user.userProfile', 'userProfile');
    qb.where('userProfile.partnerId = :partnerId', { partnerId });
    return await paginate(query, qb, { ...UserPageConfig, where });
  }

  private async _getTotalCount(partnerId: number) {
    const totalResult = await this.ds
      .getRepository(UserEntity)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userProfile', 'userProfile')
      .select('COUNT(user.id)', 'total') // Total count of orders
      .where('userProfile.partnerId = :partnerId', { partnerId })
      .getRawOne();
    return parseInt(totalResult.total, 10);
  }

  public async getUsersCount(companyId?: number) {
    const qr = this.ds.getRepository(UserEntity).createQueryBuilder('user');

    qr.leftJoin('user.userProfile', 'userProfile');
    qr.select(`COALESCE(SUM(CASE WHEN user.status = 'ACTIVE' THEN 1 ELSE 0 END), 0)`, 'active');
    qr.addSelect(`COALESCE(SUM(CASE WHEN user.status = 'PENDING' THEN 1 ELSE 0 END), 0)`, 'pending');
    qr.addSelect(`COALESCE(SUM(CASE WHEN user.status = 'BLOCKED' THEN 1 ELSE 0 END), 0)`, 'blocked');
    qr.addSelect(`COALESCE(SUM(CASE WHEN user.status = 'SUSPENDED' THEN 1 ELSE 0 END), 0)`, 'suspended');
    qr.addSelect('COUNT(user.id)', 'total'); // Count the orders
    if (companyId) {
      qr.where('userProfile.companyId = :companyId', { companyId }); // FK condition
    }

    const result = await qr.getRawOne();

    return result;
  }
}
