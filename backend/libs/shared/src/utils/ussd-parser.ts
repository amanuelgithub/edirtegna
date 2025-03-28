export interface USSDCode {
  mainCode: string;
  subCodes: string[];
}
export class USSDMessage {
  sender: string;
  text: string;
}

function validateAndParseUSSD(ussd: string): USSDCode | null {
  // Regular expression to match USSD codes like *123# or *123*abc*456#
  const ussdPattern = /^\*([0-9a-zA-Z]+)((\*[0-9a-zA-Z]+)*)#$/;

  const match = ussd.match(ussdPattern);
  if (!match) {
    return null; // Invalid USSD code
  }

  const mainCode = match[1];
  const subCodes = match[2]?.split('*')?.filter((code) => code !== ''); // Split and filter out empty strings

  return {
    mainCode,
    subCodes,
  };
}

export const getValidRechargePin = (ussd: string): string => {
  const parsedCode = validateAndParseUSSD(ussd);

  if (parsedCode) {
    return parsedCode?.subCodes.length === 2 ? parsedCode?.subCodes[1] : '';
  } else {
    return '';
  }
};
// Example usage:
// const ussdCode = '*123*abc*456#';
// const parsedCode = validateAndParseUSSD(ussdCode);
//
// if (parsedCode) {
//   console.log('Main Code:', parsedCode.mainCode);
//   console.log('Sub Codes:', parsedCode.subCodes);
// } else {
//   console.log('Invalid USSD code');
// }
