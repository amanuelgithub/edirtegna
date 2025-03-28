import { EnumValues } from '@app/shared';

//
// ADMIN realm
export const COMPANY_ADMIN = 1;
export const COMPANY_CUSTOMER_SERVICE = 2;
// CUSTOMER realm
export const PARTNER_ADMIN = 3;
export const PARTNER_CUSTOMER_SERVICE = 4;

//
//-------- HELPERS ----
export const COMPANY_ROLE = [COMPANY_ADMIN, COMPANY_CUSTOMER_SERVICE] as const;
export const CUSTOMER_ROLE = [PARTNER_ADMIN, PARTNER_CUSTOMER_SERVICE] as const;
export const ROLE = [...COMPANY_ROLE, ...CUSTOMER_ROLE] as const;

//
//-------- SEED -------
export const ROLES_SEED = [
  // administrative
  { id: COMPANY_ADMIN, name: 'COMPANY_ADMIN', description: 'Company Admin', realm: 'ADMIN' },
  { id: COMPANY_CUSTOMER_SERVICE, name: 'COMPANY_CUSTOMER_SERVICE', description: 'Company CS', realm: 'ADMIN' },
  // customer
  { id: PARTNER_ADMIN, name: 'PARTNER_ADMIN', description: 'Partner Admin', realm: 'CUSTOMER' },
  { id: PARTNER_CUSTOMER_SERVICE, name: 'PARTNER_CUSTOMER_SERVICE', description: 'Partner CS', realm: 'CUSTOMER' },
];

export type Role = EnumValues<typeof ROLE>;
