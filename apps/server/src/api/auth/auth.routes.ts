import { router, publicProcedure } from '@server/src/trpc/trpc';
import { z } from 'zod';
import {
  forgotPasswordSchema,
  loginSchema,
  refreshSchema,
  registerSchema,
} from './dtos';
import { authService } from './services';

export const authRouter = router({
  // login
  login: publicProcedure.input(loginSchema).mutation(({ input, ctx }) => {
    // console.log('input', input);

    authService.login(input);

    return null;
  }),

  // register
  register: publicProcedure.input(registerSchema).mutation(({ input, ctx }) => {
    // console.log('input', input);

    // authService.register(input);

    return null;
  }),
  // forgot password
  forgotPassword: publicProcedure
    .input(forgotPasswordSchema)
    .mutation(({ input, ctx }) => {
      // console.log('input', input);

      // authService.forgotPassword(input);

      return null;
    }),

  // refresh
  refresh: publicProcedure.input(refreshSchema).mutation(({ input, ctx }) => {
    // console.log('input', input);

    // authService.refresh(input);

    return null;
  }),

  // profile
  profile: publicProcedure.query(async ({ ctx }) => {
    // console.log('input', input);

    // authService.profile();

    return null;
  }),

  // logout
  logout: publicProcedure.input(refreshSchema).mutation(({ input, ctx }) => {
    // console.log('input', input);

    // authService.logout(input);

    return null;
  }),
});
