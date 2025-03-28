import * as crypto from 'crypto';

export function generateSecret(length?: number, symbols?: boolean) {
  // return output;
  const len = length || 32;
  let charset = '#&*0123456789ABCDEFGHJKMNOPQRSTUVWXYZ#&*0123456789abcdefghjkmnopqrstuvwxyz';
  const _symbols = '~!@#$%^&*()_+`-=[]{}|;:,./<>?';
  if (symbols) {
    charset += _symbols;
  }
  let password = '';
  for (let i = 0, n = charset.length; i < len; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
}

export const generateApiKeyHash = (key) => {
  const salt = crypto.randomBytes(8).toString('hex');
  const buffer = crypto.scryptSync(key, salt, 64);
  return `${buffer.toString('hex')}.${salt}`;
};
export const compareApiKeys = (storedInDbKey, userSuppliedKey): boolean => {
  const [hashedPassword, salt] = storedInDbKey.split('.');

  const buffer = crypto.scryptSync(userSuppliedKey, salt, 64);
  return crypto.timingSafeEqual(Buffer.from(hashedPassword, 'hex'), buffer);
};
