import { IsString } from 'class-validator';
import { TokenPayload } from './tokens';

export class AccessTokenPayload extends TokenPayload {
  // user's name
  uname: string;
  // user's phone no
  phone: string;
  // users email
  email: string;
  // user id
  uid: number;
  // customer id
  cid?: number;
  // parent customer id
  pcid: number;
  // user company id
  coid?: number;
  // user company ids
  coids?: number[];
  // allowed endpoint domain
  domain?: string;
}
export class AccessTokenDto {
  @IsString()
  accessToken: string;
}
