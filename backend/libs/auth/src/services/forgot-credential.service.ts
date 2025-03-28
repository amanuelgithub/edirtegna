import { UserEntity } from '@app/db';
import { UserNotificationService } from '@app/notification';
import { DetailResponse } from '@app/shared';
import { GetUserService } from '@app/user';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ForgotCredentialProcessor } from '../forgot-credential';

@Injectable()
export class ForgotCredentialService {
  constructor(private readonly ds: DataSource, private readonly notify: UserNotificationService, private readonly getUserService: GetUserService) {}

  public async resend(payload: ForgotCredentialProcessor): Promise<DetailResponse<UserEntity> | undefined> {
    const qryR = this.ds.createQueryRunner();
    try {
      await qryR.connect();
      await qryR.startTransaction();

      const { realm, phone, email, ua } = await payload.getRequestDto();
      const user = await this.getUserService.getByPhoneEmailAndRealm(qryR.manager, realm, phone, email);
      let updatedUser = await payload.process(user);
      //   if (await payload.isValidResend(user)) {
      //     const verifiedUser = payload.getUpdatedUserDetail();
      updatedUser = await qryR.manager.save(updatedUser);
      //   }
      await qryR.commitTransaction();
      const smsDetail = payload.getSMSDetail();
      await this.notify.sendAuthSMS(smsDetail);
      await this.notify.sendResetPasswordEmail(updatedUser, smsDetail.password, ua);
      return new DetailResponse();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(error?.message || error?.code, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } finally {
      await qryR.release();
    }
  }
}

// import {
//   AccountBlockedException,
//   CHANNEL,
//   CredentialType,
//   InvalidPhoneOrEmailException,
//   IsValidMsisdn,
//   NewDeviceDetectedException,
//   NotRegisteredForChannelException,
//   UserAccessStatus,
//   UserStatus,
//   formatUserAgent,
//   generateSecret,
//   isEmailValid,
// } from '@evd/shared';
// import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
// import { DataSource } from 'typeorm';
// import { AuthResponseDto, ForgotCredentialPayload } from '../../auth/dtos';
// import { UserEntity } from '../entities';
// import { UserNotificationService } from './user-notification.service';

// @Injectable()
// export class ForgotCredentialService {
//   constructor(
//     private readonly ds: DataSource,
//     private readonly notify: UserNotificationService,
//   ) {}

//   public async forgotCredential(forgotCredentialPayload: ForgotCredentialPayload): Promise<AuthResponseDto | undefined> {
//     const { deviceUuid, accessChannel, identifier, realm, userAgent } = forgotCredentialPayload;

//     const validEmail = isEmailValid(identifier.trim());
//     const validPhone = new IsValidMsisdn().validate(identifier);
//     if (!validPhone && !validEmail) {
//       throw new UnauthorizedException(`Value '${identifier}' is not valid email or phone number`);
//     }

//     const identifierType = validEmail ? 'EMAIL' : 'PHONE';

//     const queryRunner = this.ds.createQueryRunner();
//     try {
//       await queryRunner.connect();
//       await queryRunner.startTransaction();

//       const existingUser =
//         identifierType === 'EMAIL'
//           ? await queryRunner.manager.findOne(UserEntity, {
//               join: { alias: 'user', leftJoinAndSelect: { userAccesses: 'user.userAccesses' } },
//               where: { email: identifier, realm },
//             })
//           : await queryRunner.manager.findOne(UserEntity, {
//               join: { alias: 'user', leftJoinAndSelect: { userAccesses: 'user.userAccesses' } },
//               where: { phone: identifier, realm },
//             });

//       // User Doesn't exist
//       if (!existingUser) {
//         throw new InvalidPhoneOrEmailException();
//       }
//       const userAccess = existingUser.userAccesses.find((o) => o.accessChannel === CHANNEL[accessChannel]);

//       // Check if user is allowed APP channel
//       if (!userAccess) {
//         throw new NotRegisteredForChannelException();
//       }
//       // User Blocked / Suspended
//       if ([UserStatus.BLOCKED, UserStatus.SUSPENDED].includes(existingUser.status) || [UserAccessStatus.BLOCKED, UserAccessStatus.SUSPENDED].includes(userAccess.status)) {
//         throw new AccountBlockedException();
//       }

//       let pinCode, password;

//       // WEB Access Set password
//       if (accessChannel === 'WEB') {
//         // New device login for web login
//         const { deviceHash } = formatUserAgent(userAgent, existingUser.id);
//         if (userAccess.deviceHash !== deviceHash) {
//           throw new NewDeviceDetectedException();
//         }

//         password = generateSecret(6, false);
//         userAccess.passwordHash = await bcrypt.hash(password, 12);
//         userAccess.type = CredentialType.SYS_SET;
//       }
//       // App Access set pin
//       if (accessChannel === 'APP') {
//         // PIN and phone required
//         if (identifierType !== 'PHONE') {
//           return {
//             success: false,
//             message: `Operation requires a valid identifying phone number`,
//             statusCode: 414, // 'PHONE_AND_PIN_REQUIRED',
//             // user: existingUser,
//           };
//         }
//         if (!deviceUuid) {
//           return {
//             success: false,
//             message: `Operation requires a valid device uuid`,
//             statusCode: 426, // 'MISSIG_DEVICE_ID',
//             // user: existingUser,
//           };
//         }
//         // New device login for app login
//         if (userAccess.deviceUuid !== deviceUuid) {
//           throw new NewDeviceDetectedException();
//         }

//         // existingUser.tempPinCode = tempPinCode;
//         // existingUser.pinCode = null;
//         pinCode = Math.floor(1000 + Math.random() * 9000);
//         userAccess.type = CredentialType.SYS_SET;
//         userAccess.pinCode = pinCode;
//       }
//       existingUser.userAccesses = [...existingUser.userAccesses, userAccess];
//       const updatedUser = await queryRunner.manager.save(UserEntity, existingUser);
//       await queryRunner.commitTransaction();

//       // send otp sms
//       await this.notify.sendAuthSMS({
//         name: updatedUser.fullName,
//         msg: `Your reset request is processed successfully.`,
//         pinCode,
//         password,
//         destination: updatedUser.phone,
//         subject: `FORGOT_RESEND`,
//         userId: updatedUser.id,
//       });

//       //
//       // send email
//       //
//       if (updatedUser.email) {
//         await this.notify.sendWelcomeEmail(updatedUser, password, realm);
//       }

//       return { success: true, statusCode: 200, message: 'Set temporary credential Successful' };
//     } catch (error) {
//       await queryRunner.rollbackTransaction();
//       if (error.status === HttpStatus.BAD_REQUEST || error.status === HttpStatus.NOT_FOUND) {
//         throw error;
//       } else {
//         throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//       }
//     } finally {
//       await queryRunner.release();
//     }
//   }
// }
