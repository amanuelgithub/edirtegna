import { HttpStatus, Logger } from '@nestjs/common';
import { createSign, createVerify, generateKeyPair } from 'crypto';

export interface IKeyPair {
  publicKey: string;
  privateKey: string;
}
export class SecurityUtil {
  //
  // ------------------------------------------
  // generate key
  // ------------------------------------------
  static sortObject(dataObj: any): any {
    if (dataObj === null) return null;
    if (typeof dataObj !== 'object') return dataObj;
    if (Array.isArray(dataObj)) return dataObj.map(SecurityUtil.sortObject);
    const sortedKeys = Object.keys(dataObj).sort();
    const result: any = {};
    sortedKeys.forEach((key) => {
      result[key] = SecurityUtil.sortObject(dataObj[key]);
    });
    return result;
    ///
    // return Object.keys(dataObj)
    //   .sort()
    //   .reduce((obj, key) => {
    //     obj[key] = dataObj[key];
    //     return obj;
    //   }, {});
  }
  //
  // ------------------------------------------
  // generate key
  // ------------------------------------------
  static getECKeyPair(): Promise<IKeyPair | undefined> {
    return new Promise((success, failure) => {
      generateKeyPair(
        'ec',
        {
          namedCurve: 'P-256',
          publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
          },
        },
        function (err, publicKey, privateKey) {
          if (err) {
            //   throw err;
            return failure(err);
          } // may signify a bad 'type' name, etc

          return success({ privateKey, publicKey });
        },
      );
    });
  }
  //
  // ------------------------------------------
  // parse key
  // ------------------------------------------
  static parse(key: any, type: 'PRIVATE' | 'PUBLIC'): string {
    const START_END = ['-----BEGIN EC PRIVATE KEY-----', '-----END EC PRIVATE KEY-----', '-----BEGIN PUBLIC KEY-----', '-----END PUBLIC KEY-----'];
    let temp = key?.toString()?.trim();
    START_END.forEach((o) => {
      temp = temp?.replace(o, '');
    });
    temp = temp?.split(/\r\n|\r|\n/)?.join('');
    temp = temp?.replace(/.{64}/g, '$&\n')?.trim();
    const beginLine = START_END.filter((o) => o.includes('BEGIN') && o.includes(type))[0];
    const endLine = START_END.filter((o) => o.includes('END') && o.includes(type))[0];
    return `${beginLine}\n${temp}\n${endLine}`;
  }
  //
  // ------------------------------------------
  // sign
  // ------------------------------------------
  static sign(data: object, privateKey: string): string {
    try {
      const dataStr = JSON.stringify(data);
      const sign = createSign('SHA256');
      sign.update(dataStr);

      // check if private key is set
      if (!privateKey) {
        throw { Code: HttpStatus.UNAUTHORIZED, message: `Configuration value for 'fcmPrivateKey' not found` };
      }
      // check if data is set
      if (!data) {
        throw { Code: HttpStatus.UNAUTHORIZED, message: `Request requires valid request body` };
      }
      const signature = sign.sign(SecurityUtil.parse(privateKey, 'PRIVATE'), 'base64');
      return signature;
    } catch (err) {
      Logger.error({ message: err.message || err, meta: err, stack: err, context: `sign` });
      throw { Code: err.Code || HttpStatus.UNAUTHORIZED, message: err.message || err };
    }
  }
  //
  // ------------------------------------------
  // verify
  // ------------------------------------------
  static verify(data: object, signature: string, publicKey: string): boolean | undefined {
    try {
      // check if publicKey is set
      if (!publicKey) {
        throw { Code: HttpStatus.UNAUTHORIZED, message: `Verification Key Required` };
      }

      // check if signature is set
      if (!signature) {
        throw {
          Code: HttpStatus.UNAUTHORIZED,
          message: `Signature Value not set`,
        };
      }
      // check signature type and length
      if (typeof signature !== 'string' || signature.length !== 96) {
        throw {
          Code: HttpStatus.UNAUTHORIZED,
          message: `Invalid signature supplied`,
        };
      }

      // check if data is set
      if (!data) {
        throw { Code: HttpStatus.UNAUTHORIZED, message: `Verification Data is required` };
      }

      const verify = createVerify('SHA256');
      const _dataStr = typeof data === 'string' ? data : JSON.stringify(data);
      verify.update(_dataStr);

      const verified = verify.verify(SecurityUtil.parse(publicKey, 'PUBLIC'), signature, 'base64');

      if (!verified) {
        throw { Code: HttpStatus.UNAUTHORIZED, message: `Client Signature does not match` };
      }

      return verified;
    } catch (err) {
      Logger.error({ message: err.message || err, meta: err, stack: err, context: `verify` });
      throw err;
    }
  }
}
