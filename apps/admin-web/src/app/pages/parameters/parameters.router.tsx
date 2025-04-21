import { RouteObject } from 'react-router-dom';
import ListCountries from './countries/ListCountries';
import ListStates from './states/ListStates';
import ListCities from './cities/ListCities';

export const parametersRouter: RouteObject[] = [
  {
    path: '/countries',
    element: <ListCountries />,
  },
  {
    path: '/states',
    element: <ListStates />,
  },
  {
    path: '/cities',
    element: <ListCities />,
  },
];
