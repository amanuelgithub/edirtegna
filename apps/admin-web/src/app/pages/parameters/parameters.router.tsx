import { RouteObject } from 'react-router-dom';
import CountriesListPage from './countries/CountriesListPage';

export const parametersRouter: RouteObject[] = [
  {
    path: '/countries',
    element: <CountriesListPage />,
    // element: <div>Countries</div>,
  },
  {
    path: '/states',
    element: <div>States</div>,
  },
];
