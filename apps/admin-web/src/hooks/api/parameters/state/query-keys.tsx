import { PaginationType } from '../../base';

// define the query keys here
export const stateKeys = {
  getAllStates: () => ['states'] as const,
  specificStates: (pageOptions?: PaginationType) =>
    [...stateKeys.getAllStates(), pageOptions] as const,
  getStateById: (stateId?: number) => ['states', stateId] as const,
};
