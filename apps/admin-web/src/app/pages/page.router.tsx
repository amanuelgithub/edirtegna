import { RouteObject } from 'react-router-dom';
import DashboardPage from './dashboard.tsx';
import ProtectedRoute from '@/components/protected-route.tsx';
import UsersPage from './users/index.tsx';
import { AdminDashboardLayout } from '@/components/layouts/layout.tsx';
import { parametersRouter } from './parameters/parameters.router.tsx';
import { usersRouter } from './users/users.router.tsx';

export const pageRouter: RouteObject[] = [
  {
    path: '/',
    element: (
      <AdminDashboardLayout>
        <ProtectedRoute />
      </AdminDashboardLayout>
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
        // element: <ProtectedRoute />,
        // children: [{ index: true, element: <DashboardPage /> }],
      },
      ...usersRouter,
      ...parametersRouter,
    ],
  },
];
