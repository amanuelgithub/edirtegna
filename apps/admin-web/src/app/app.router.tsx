import { createBrowserRouter } from 'react-router-dom';
import { pageRouter } from './pages/page.router';
import { authRouter } from './auth/auth.router';

export const mainRouter = createBrowserRouter([
  // {
  //   path: '/',
  //   element: <App />,
  //   children: [...authRouter, ...pageRouter],
  // },
  ...authRouter,
  ...pageRouter,
]);
