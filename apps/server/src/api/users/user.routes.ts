import { router, publicProcedure } from '@server/src/trpc';
import { z } from 'zod';
import { usersService } from './users.service';

export const userRouter = router({
  // create: publicProcedure.input(user: Partial<UserEntity>)
  create: publicProcedure
    .input(
      z.object({
        id: z.number().optional(),
        name: z.string(),
      }),
    )
    .mutation((input) => {
      return usersService.create(input.input);
    }),

  findUsers: publicProcedure.query(async () => {
    return await usersService.findAll();
  }),

  findUserById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query((input) => {
      return usersService.findOne(input.input.id, input.ctx.req, input.ctx.res);
    }),

  updateUser: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
      }),
    )
    .query(({ input, ctx }) => {
      return usersService.update(input.id, input, ctx.req, ctx.res);
    }),
});
