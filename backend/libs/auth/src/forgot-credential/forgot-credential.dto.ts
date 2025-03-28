import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ForgotCredentialDto {
  @IsString()
  identifier: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  deviceUuid?: string;
}
