import { Module, OnModuleInit } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { UsersModule } from '@app/users';
import { TrpcModule } from '@app/trpc';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'P@ss1234',
      database: 'edirtegna',
      entities: [UserEntity],
      synchronize: true,
    }),

    UsersModule,
    TrpcModule,
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule implements OnModuleInit {
  constructor(private readonly ds: DataSource) {}

  onModuleInit() {
    // throw new Error('Method not implemented.');

    this.seedDatabase().catch((error: any) => {
      console.error('Error seeding database:', error);
      this.ds.destroy();
    });
  }

  async seedDatabase() {
    console.log('connection to the database is already created...');
    // console.log('Connecting to the database...');
    // await this.ds.initialize();

    const userRepository = this.ds.getRepository(UserEntity);

    console.log('Seeding Users...');
    const users: UserEntity[] = [];
    for (let i = 0; i < 10; i++) {
      const user = new UserEntity();
      user.name = faker.name.firstName();
      // user.lastName = faker.name.lastName();
      // user.email = faker.internet.email();
      // user.password = faker.internet.password(); // Ideally, hash this in production
      // user.isActive = faker.datatype.boolean();
      users.push(user);
    }

    // await userRepository.save(users);

    console.log('Seeding completed!');
    // await ds.destroy();
  }
}
