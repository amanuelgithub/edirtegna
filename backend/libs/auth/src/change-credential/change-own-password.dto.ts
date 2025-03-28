import { IsEqualTo, IsPasswordValid } from '@app/shared';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { IChangeOwnCredential, IPreviousAndNewCredential } from './previous-new-credential';

export class ChangeOwnPasswordDto implements IChangeOwnCredential {
  getPreviousAndNewCredential(): IPreviousAndNewCredential {
    return {
      previousCredential: this.previousPassword,
      newCredential: this.newPassword,
    };
  }
  @IsString()
  @IsNotEmpty()
  previousPassword: string;

  @IsPasswordValid()
  @MinLength(6)
  @MaxLength(127)
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(128)
  @IsEqualTo('newPassword')
  confirmPassword: string;
}
