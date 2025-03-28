import { IsString } from 'class-validator';
import { AzpType } from './azp-type';

export class TokenPayload {
  // token expiry time
  exp: number;
  // time token issued at
  edirtegna: number;
  // token type: Bearer | Refresh
  typ: string;
  // "http://localhost:8080/auth/realms/tp_admin"
  iss: string;
  // evd-customer-app | evd-manager-app | evd-customer-web | evd-manager-web | evd-customer-api
  azp: AzpType;
  // subject: users identity id (user's unique uuid) - exposed externally
  sub: string;
  // user role
  role: string;
  // user role id
  roleId: number;
  // realm (role category) could be 'ADMIN' or 'CUSTOMER'
  realm: string;
}

export class TokensDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
export class TokensResponseDto {
  accessToken?: string;
  refreshToken?: string;
  success: boolean;
  statusCode: number;
  message: string;
}
