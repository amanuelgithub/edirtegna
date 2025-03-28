import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
// import * as lpn from 'google-libphonenumber';
import { parsePhoneNumber } from 'awesome-phonenumber';

@ValidatorConstraint()
export class IsValidMsisdn implements ValidatorConstraintInterface {
  // static phoneUtil: any = lpn.PhoneNumberUtil.getInstance();

  validate(phone: string) {
    try {
      //const num = IsValidMsisdn.phoneUtil.isValidNumberForRegion(IsValidMsisdn.phoneUtil.parse(phone, 'ET'), 'ET');
      // const num = IsValidMsisdn.phoneUtil.isPossibleNumber(IsValidMsisdn.phoneUtil.parse(phone, 'ET'));
      const pn = parsePhoneNumber(phone, { regionCode: 'ET' });
      return pn.valid; //??pn?.number?.e164;
    } catch (error) {
      return false;
    }
  }
}
/* 
@Validate(IsValidMsisdn, {    message: 'Invalid ethiopian phone or service number'  })
   */
export function isValidEthiopianPhone(phone: string): boolean {
  try {
    // const phoneUtil: any = lpn.PhoneNumberUtil.getInstance();
    // const result = phoneUtil.isPossibleNumber(phoneUtil.parse(phone, 'ET'));
    // return result;
    const pn = parsePhoneNumber(phone, { regionCode: 'ET' });
    return pn.valid; //??pn?.number?.e164;
  } catch (error) {
    return false;
  }
}
// E164 format	+251911756708
// Returns	251911756708
export function getPhoneFormatForSMSgw(phoneNumber: string, regionCode = 'ET') {
  // let number: lpn.PhoneNumber;
  // const phoneUtil: any = lpn.PhoneNumberUtil.getInstance();
  try {
    const pn = parsePhoneNumber(phoneNumber, { regionCode });
    return pn.valid ? pn?.number?.e164?.substring(1) : '';
    // number = phoneUtil.parse(phoneNumber, countryCode.toUpperCase());
  } catch (e) {}
  return ''; //phoneUtil.format(number, lpn.PhoneNumberFormat.E164).substring(1);
}
export function getPhoneFormatNational(phoneNumber: string, regionCode = 'ET') {
  try {
    const pn = parsePhoneNumber(phoneNumber, { regionCode });
    return pn.valid ? pn?.number?.e164 : '';
    // number = phoneUtil.parse(phoneNumber, countryCode.toUpperCase());
  } catch (e) {}
  return '';
  //   let number: lpn.PhoneNumber;
  //   const phoneUtil: any = lpn.PhoneNumberUtil.getInstance();
  //   try {
  //     number = phoneUtil.parse(phoneNumber, countryCode.toUpperCase());
  //   } catch (e) {}
  //   return number.getNationalNumber();
}

export const normalizePhoneSearchTerm = (searchQry: string) => {
  const qryParam = encodeURIComponent(searchQry.trim().replace('+', '')).replace('%20', '');
  let searchTerm = qryParam;
  if (qryParam.startsWith('0')) {
    searchTerm = qryParam.slice(1);
  } else if (qryParam.startsWith('251')) {
    searchTerm = qryParam.slice(3);
  } else if (qryParam.startsWith('+251')) {
    searchTerm = qryParam.slice(4);
  }
  return searchTerm;
};
