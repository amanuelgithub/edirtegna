import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly ds: DataSource) {}

  async findAll() {
    const users = await this.ds.getRepository(UserEntity).find();
    console.log('users', users);
    return users;
  }
}
