import { authRouter } from '../api/auth';
import { userRouter } from '../api/users';
import { router } from './trpc';

export const appRouter = router({
  auth: authRouter,
  users: userRouter,
});

// this is being exported from the app.ts file
// export type AppRouter = typeof appRouter;
