import { RouteObject } from 'react-router-dom';
import ListCompanyUsers from './company-users/ListCompanyUsers';

export const usersRouter: RouteObject[] = [
  {
    path: '/users/company-users',
    element: <ListCompanyUsers />,
  },
  {
    path: '/users/customer-users',
    element: <div>customer users</div>,
  },
];
