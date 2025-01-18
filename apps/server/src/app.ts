import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import * as trpcExpress from '@trpc/server/adapters/express';
// import { createContext, appRouter } from "./trpc";
// import { createContext } from './trpc';
import { appRouter } from './routes/router';
import { createContext } from '@edirtegna/trpc-server';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(
  '/api/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.get('/', (req, res) => {
  res.send('Server is working fine 👍 👍 👍 ');
});
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 🚀 🚀 Server listening on port ${port}`);
});

export type AppRouter = typeof appRouter;
