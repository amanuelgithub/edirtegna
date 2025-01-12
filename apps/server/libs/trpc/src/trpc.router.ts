import { INestApplication, Injectable } from '@nestjs/common';
import { z } from 'zod';
import * as trpcExpress from '@trpc/server/adapters/express';
import { TrpcService } from './trpc.service';
import { UsersService } from '@app/users';

@Injectable()
export class TrpcRouter {
  constructor(
    private readonly trpcService: TrpcService,
    private readonly usersService: UsersService,
  ) {}

  appRouter = this.trpcService.router({
    getUsers: this.trpcService.procedure
      .input(
        z.object({
          // name: z.string().optional(),
        }),
      )
      .query(async () => {
        // const { name } = input;

        const users = await this.usersService.findAll();
        console.log('users', users);

        return {
          data: users,
        };
      }),
  });

  async applyMiddleware(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({
        router: this.appRouter,
      }),
    );
  }
}

export type AppRouter = TrpcRouter['appRouter'];
