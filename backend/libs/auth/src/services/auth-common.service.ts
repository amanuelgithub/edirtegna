import { Injectable } from '@nestjs/common';
import { AzpType, RefreshTokenDto } from '../dtos';
import { TokenService } from './token.service';

@Injectable()
export class AuthCommonService {
  constructor(private readonly tokenService: TokenService) {}

  public refreshAccessToken(refreshDto: RefreshTokenDto, azp: AzpType) {
    const { refreshToken } = refreshDto;
    return this.tokenService.validRefreshToken(refreshToken, azp);
  }
  public async logoutRefreshToken(refreshDto: RefreshTokenDto, azp: AzpType) {
    const { refreshToken } = refreshDto;
    await this.tokenService.logoutRefreshToken(refreshToken, azp);
    return { success: true, statusCode: 200, message: 'Logout Successful' };
  }
}
