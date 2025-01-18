import { authRouter } from '../api/auth';
import { userRouter } from '../api/users';
// import { router } from '@server/src/trpc';
import { router, publicProcedure } from '@edirtegna/trpc-server';
import { z } from 'zod';

export const appRouter = router({
  auth: authRouter,
  users: userRouter,
  hello: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
      }),
    )
    .query(({ input }) => {
      return `Hello ${input?.name ?? 'World'}`;
    }),
});

// this is being exported from the app.ts file
// export type AppRouter = typeof appRouter;
