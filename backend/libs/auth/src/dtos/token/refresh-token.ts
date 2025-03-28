import { IsOptional, IsString } from 'class-validator';
import { TokenPayload } from './tokens';

export class RefreshTokenPayload extends TokenPayload {}

export class RefreshTokenDto {
  @IsString()
  @IsOptional()
  refreshToken: string;
}
