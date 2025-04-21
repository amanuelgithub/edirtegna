import { RouteObject } from 'react-router-dom';
import ListCountries from './countries/ListCountries';

export const parametersRouter: RouteObject[] = [
  {
    path: '/countries',
    element: <ListCountries />,
    // element: <div>Countries</div>,
  },
  {
    path: '/states',
    element: <div>States</div>,
  },
];
