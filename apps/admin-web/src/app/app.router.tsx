import { createBrowserRouter } from 'react-router-dom';
import { pageRouter } from './pages/page.router';
import { authRouter } from './auth/auth.router';
import NotFoundPage from '../components/not-found/not-found.page'; // Import the NotFoundPage

export const mainRouter = createBrowserRouter([
  //
  ...authRouter,
  ...pageRouter,
  {
    path: '*', // Catch-all route for 404
    element: <NotFoundPage />, // Attach NotFoundPage as the element
  },
]);
