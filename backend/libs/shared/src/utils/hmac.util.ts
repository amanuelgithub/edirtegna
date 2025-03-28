import { createHmac, timingSafeEqual } from 'crypto';
export class HmacUtil {
  static maxDeviation = 5;

  static sign(payload, secret) {
    const t = Math.floor(Date.now() / 1000);
    const payload_string = JSON.stringify(payload);
    const signed_payload = t.toString() + '.' + payload_string;
    const hmac = createHmac('sha256', secret);
    hmac.update(signed_payload);
    const digest = hmac.digest('hex');
    return `t=${t},v0=${digest}`;
  }

  static sort(object) {
    if (typeof object != 'object' || object instanceof Array)
      // Not to sort the array
      return object;
    const keys = Object.keys(object);
    keys.sort();
    const newObject = {};
    for (let i = 0; i < keys.length; i++) {
      newObject[keys[i]] = HmacUtil.sort(object[keys[i]]);
    }
    return newObject;
  }

  static sorted(o) {
    const isObj = (x) => typeof x === 'object';
    const isArr = Array.isArray;
    const isSortable = (x) => x !== null && (isObj(x) || isArr(x));

    if (!isSortable(o)) return o;

    if (isArr(o)) return o.map(HmacUtil.sorted);

    if (isObj(o))
      return Object.keys(o)
        .sort()
        .reduce((m, x) => ((m[x] = isSortable(o[x]) ? HmacUtil.sorted(o[x]) : o[x]), m), {});
  }

  static verify(signature, secret, payload) {
    const src_elements = signature.split(',');
    const src_t = +src_elements[0].split('=')[1];

    // validate timestamp
    const now = Math.floor(Date.now() / 1000);
    const deviation = now - src_t;
    if (deviation > HmacUtil.maxDeviation) {
      return false;
    }

    // validate signature
    const payload_string = JSON.stringify(payload);
    const signed_payload = src_t + '.' + payload_string;
    const hmac = createHmac('sha256', secret);
    hmac.update(signed_payload);

    const src_hash = src_elements[1].split('=')[1];
    const cmp_hash = hmac.digest('hex');

    return timingSafeEqual(Buffer.from(src_hash), Buffer.from(cmp_hash));
  }

  static setMaxDeviation(value) {
    HmacUtil.maxDeviation = Math.max(Math.min(30, value), 1);
  }

  // static generateSecret(length, symbols) {
  //     const len = length || 32;
  //     let charset = '#&*0123456789ABCDEFGHJKMNOPQRSTUVWXYZ#&*0123456789abcdefghjkmnopqrstuvwxyz';
  //     const _symbols = '~!@#$%^&*()_+`-=[]{}|;:,./<>?';
  //     if (symbols) {
  //         charset += _symbols;
  //     }
  //     let password = '';
  //     for (let i = 0, n = charset.length; i < len; ++i) {
  //         password += charset.charAt(Math.floor(Math.random() * n));
  //     }
  //     return password;
  // }
  // static generateApiKeyHash(key) {
  //     const salt = crypto.randomBytes(8).toString('hex');
  //     const buffer = crypto.scryptSync(key, salt, 64);
  //     return `${buffer.toString('hex')}.${salt}`;
  // }
  // static compareApiKeys(storedInDbKey, userSuppliedKey) {
  //     const [hashedPassword, salt] = storedInDbKey.split('.');
  //     const buffer = crypto.scryptSync(userSuppliedKey, salt, 64);
  //     return crypto.timingSafeEqual(Buffer.from(hashedPassword, 'hex'), buffer);
  // }
}
