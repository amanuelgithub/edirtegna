import { Realm } from '@app/shared';

export interface IAccountSMSBody {
  name: string;
  otpCode?: number;
  pinCode?: number;
  password?: string;
  realm?: Realm;
  msg?: string;
}
export interface IAccountSMS extends IAccountSMSBody {
  destination: string;
  subject: string;
  userId: number;
}
