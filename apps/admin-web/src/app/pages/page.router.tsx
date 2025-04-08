import { RouteObject } from 'react-router-dom';
import DashboardPage from './dashboard.tsx';
import ProtectedRoute from '@/components/protected-route.tsx';

export const pageRouter: RouteObject[] = [
  {
    path: '/dashboard',
    element: <ProtectedRoute />,
    children: [{ index: true, element: <DashboardPage /> }],
  },
];
