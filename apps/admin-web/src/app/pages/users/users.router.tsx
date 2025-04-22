import { RouteObject } from 'react-router-dom';
import ListCompanyUsers from './company-users/ListCompanyUsers';
import ListCustomerUsers from './client-users/ListCustomerUsers';

export const usersRouter: RouteObject[] = [
  {
    path: '/users/company-users',
    element: <ListCompanyUsers />,
  },
  {
    path: '/users/customer-users',
    element: <ListCustomerUsers />,
  },
];
