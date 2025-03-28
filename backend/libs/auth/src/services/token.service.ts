import { UserEntity } from '@app/db';
import { AuthConfigDto, GlobalConfigService } from '@app/global-config';
import { RedisService } from '@app/redis';
import { GetUserService } from '@app/user';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import Decimal from 'decimal.js';
import { ACC_TOKEN_CACHE_STORE_PREFIX, REF_TOKEN_CACHE_STORE_PREFIX } from '../constants';
import { AccessTokenPayload, AzpType, RefreshTokenPayload, TokenPayload, TokensDto } from '../dtos';
@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly getUserService: GetUserService,
    private readonly jwtService: JwtService,
    private readonly authRedisService: RedisService,
    private readonly globalConfigService: GlobalConfigService,
  ) {}

  private issuer = this.configService.get('app').webApiUrl;

  private async signRefreshToken(payload: RefreshTokenPayload): Promise<string | undefined> {
    const conf = this.configService.get('jwtRefresh');

    const refToken = await this.jwtService.signAsync(payload, {
      privateKey: conf.privateKey,
      algorithm: 'ES256',
      keyid: '354e8056-9727-407c-9a97-1dfea271d22',
    });

    return refToken;
  }

  private async signAccessToken(payload: AccessTokenPayload): Promise<string | undefined> {
    const conf = this.configService.get('jwt');
    const accessToken = this.jwtService.signAsync(payload, {
      privateKey: conf.privateKey.replace(/\\n/g, '\n'),
      algorithm: 'ES256',
      keyid: 'fec6c706-bd06-4172-a405-a1fef21f070a',
    });
    return accessToken;
  }
  public async createTokenPair(user: UserEntity, azp: AzpType): Promise<TokensDto | undefined> {
    const sysConf = (await this.globalConfigService.getConfigByKey<AuthConfigDto>('auth')) as AuthConfigDto;
    const NOW_SECONDS = Math.round(Number(new Date()) / 1000);

    // accessToken

    const accessLife = sysConf.accessTokenLifespan;
    const accessExp = new Decimal(NOW_SECONDS).plus(accessLife).toNumber();

    // refreshToken
    const refreshLife = sysConf.refreshTokenLifespan;
    const refreshExp = new Decimal(NOW_SECONDS).plus(refreshLife).toNumber();

    const payload: TokenPayload = {
      sub: user?.idpId,
      role: user.role?.name,
      roleId: user.roleId,
      realm: user.realm,
      iat: NOW_SECONDS,
      typ: 'Bearer',
      iss: this.issuer,
      exp: accessExp,
      azp,
    };
    const accessPayload: AccessTokenPayload = {
      ...payload,
      uname: '', //user?.userName,
      phone: user.phone,
      email: user.email,
      uid: user.id,
      cid: user?.userProfileId,
      pcid: user?.id, //user.id, //user?.parentUserId,
    };

    const refreshPayload: RefreshTokenPayload = {
      ...payload,
      typ: 'Refresh',
      exp: refreshExp,
    };
    const [accessToken, refreshToken] = await Promise.all([this.signAccessToken(accessPayload), this.signRefreshToken(refreshPayload)]);

    const key = `${payload.sub}_${payload.azp}`;
    await this.authRedisService.putValue(key, { accessToken }, accessLife, ACC_TOKEN_CACHE_STORE_PREFIX);
    await this.authRedisService.putValue(key, { refreshToken }, refreshLife, REF_TOKEN_CACHE_STORE_PREFIX);

    return { accessToken, refreshToken };
  }

  public async verifyAccessToken(accessToken: string): Promise<AccessTokenPayload | undefined> {
    try {
      if (!accessToken) {
        return;
      }
      const conf = this.configService.get('jwt');
      const result = await this.jwtService.verifyAsync<AccessTokenPayload>(accessToken, {
        publicKey: conf.publicKey.replace(/\\n/g, '\n'),
        algorithms: ['ES256'],
        ignoreExpiration: false,
      });
      return result;
    } catch (error) {
      Logger.error({ message: `verifyAccessToken failed`, stack: error, context: TokenService.name });
      return;
    }
  }

  public async decodeRefreshToken(refreshToken: string): Promise<RefreshTokenPayload | undefined> {
    const refPayload: RefreshTokenPayload = (await this.jwtService.decode(refreshToken, {
      json: true,
    })) as RefreshTokenPayload;

    return refPayload;
  }
  public async validRefreshToken(refreshToken: string, azp: AzpType): Promise<TokensDto | undefined> {
    const refPayload: RefreshTokenPayload = await this.decodeRefreshToken(refreshToken);

    if (!refPayload) {
      // trhow error...
      throw new HttpException(`Invalid or expired refresh token provided.`, HttpStatus.UNAUTHORIZED);
    }

    const refTokenKey = `${refPayload.sub}_${azp}`;
    const data = await this.authRedisService.getValue<TokensDto>(refTokenKey, REF_TOKEN_CACHE_STORE_PREFIX);
    if (!data || data?.refreshToken !== refreshToken) {
      // trhow error...
      throw new HttpException(`Invalid or expired refresh token provided.`, HttpStatus.UNAUTHORIZED);
    }
    const user = await this.getUserService.getBy({ idpId: refPayload?.sub });
    return this.createTokenPair(user.data, azp);
  }
  public async logoutRefreshToken(refreshToken: string, azp: AzpType): Promise<void | undefined> {
    const refPayload: RefreshTokenPayload = (await this.jwtService.decode(refreshToken, {
      json: true,
    })) as RefreshTokenPayload;
    if (!refPayload) {
      // trhow error...
      throw new HttpException(`Invalid or expired refresh token provided.`, HttpStatus.UNAUTHORIZED);
    }
    const refTokenKey = `${refPayload.sub}_${azp}`;
    const r = await this.authRedisService.deleteEntry(refTokenKey, REF_TOKEN_CACHE_STORE_PREFIX);
    Logger.log(r);
    return;
  }
}
