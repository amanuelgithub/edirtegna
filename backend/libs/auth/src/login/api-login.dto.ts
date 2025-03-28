import { IsString } from 'class-validator';

export class ApiKeyLoginDto {
  @IsString()
  key: string;
}

export interface IApiKeyParts {
  userId: number;
  apiClientId: string;
  key: string;
}
