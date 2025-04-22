import { RouteObject } from 'react-router-dom';
import ListCompanyUsers from './company-users/ListCompanyUsers';

export const usersRouter: RouteObject[] = [
  {
    path: '/users',
    element: <ListCompanyUsers />,
  },
];
