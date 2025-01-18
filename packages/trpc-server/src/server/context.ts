import { inferAsyncReturnType } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';

export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('token: ', token);

  return { req, res };
};

export type Context = inferAsyncReturnType<typeof createContext>;
