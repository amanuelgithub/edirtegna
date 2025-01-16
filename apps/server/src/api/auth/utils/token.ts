import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

async function signAccessToken(payload: any) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || '', {
    expiresIn: '15m',
  });
}

async function signRefreshToken(payload: any) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET || '', {
    expiresIn: '30d',
  });
}

async function createTokenPair(payload: any) {
  const accessToken = await signAccessToken(payload);
  const refreshToken = await signRefreshToken(payload);
  return { accessToken, refreshToken };
}

async function verifyAccessToken(token: string) {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '');
}
