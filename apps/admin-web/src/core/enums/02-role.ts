//

import { EnumValues } from './enum-type';

// ADMIN realm
export const COMPANY_ADMIN = 1;
export const COMPANY_CUSTOMER_SERVICE = 2;
// CUSTOMER realm
export const CUSTOMER = 3;

//
//-------- HELPERS ----
export const COMPANY_ROLE = [COMPANY_ADMIN, COMPANY_CUSTOMER_SERVICE] as const;
// export const CUSTOMER_ROLE = [PARTNER_ADMIN, PARTNER_CUSTOMER_SERVICE] as const;
export const CUSTOMER_ROLE = [CUSTOMER] as const;
export const ROLE = [...COMPANY_ROLE, ...CUSTOMER_ROLE] as const;

//
//-------- SEED -------
export const ROLES_SEED = [
  // administrative
  {
    id: COMPANY_ADMIN,
    name: 'COMPANY_ADMIN',
    description: 'Company Admin',
    realm: 'ADMIN',
  },
  {
    id: COMPANY_CUSTOMER_SERVICE,
    name: 'COMPANY_CUSTOMER_SERVICE',
    description: 'Company CS',
    realm: 'ADMIN',
  },
  // // customer
  {
    id: CUSTOMER,
    name: 'CUSTOMER',
    description: 'Customer',
    realm: 'CUSTOMER',
  },
];

export type Role = EnumValues<typeof ROLE>;
