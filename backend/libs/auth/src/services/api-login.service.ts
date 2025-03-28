// import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
// import { isApiKeyMatch, UserStatus } from '@evd/shared';
// import { ClientEntity } from '../entities';
// import { getConnection } from 'typeorm';
// import { AuthResponseDto, ApiKeyLoginDto } from '../../auth/dtos';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class ApiLoginService {
//   constructor(private readonly conf: ConfigService) {}
//   private getValidKey(apiKey: string) {
//     const parts = Buffer.from(apiKey, 'base64').toString('utf8').split(':');
//     if (!parts || parts.length !== 3) {
//       throw new UnauthorizedException(`1.Invalid Credential Provided`);
//     }
//     const id = parts[0]; // client id
//     const idpId = parts[1]; // user table idpId
//     const secretKey = parts[2]; // secret

//     const regexExpV4 = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
//     // console.log('--------------------------------------------', parts);
//     if (!regexExpV4.test(id) || !regexExpV4.test(idpId) || secretKey.length !== 32) {
//       throw new UnauthorizedException(`2.Invalid Credential Provided`);
//     }
//     return { id, idpId, secretKey };
//   }
//   public async login(loginDto: ApiKeyLoginDto, ipAddress: string, origin: string): Promise<AuthResponseDto | undefined> {
//     // VALIDATION...

//     const { key } = loginDto;
//     const { id, idpId, secretKey } = this.getValidKey(key);

//     const connection = getConnection();
//     const queryRunner = connection.createQueryRunner();
//     try {
//       await queryRunner.connect();
//       await queryRunner.startTransaction();
//       // Get Existing Client
//       const client = await queryRunner.manager.findOne(ClientEntity, {
//         join: {
//           alias: 'c',
//           leftJoinAndSelect: {
//             user: 'c.user',
//             customerProfile: 'user.customerProfile',
//             // userAccesses: 'user.userAccesses',
//             // accessDevices: 'userAccesses.accessDevices',
//           },
//         },
//         where: { id, user: { role: 'MERCHANT' } },
//       });
//       // console.log('.................client', client, client?.user);
//       // Client / User Doesn't exist
//       if (!client) {
//         throw new UnauthorizedException(`Invalid Credential Provided`);
//       }
//       const existingUser = client.user;
//       if (!existingUser) {
//         throw new UnauthorizedException(`Invalid Credential Provided`);
//       }
//       // check source url
//       const isRegisteredIp = client.allowedUrls.split(',').includes(ipAddress);
//       // console.log('isRegisteredIp', isRegisteredIp);
//       const isRegisteredOrigin = client.allowedUrls.split(',').includes(origin);
//       // console.log('isRegisteredOrigin', isRegisteredOrigin);
//       const isRegisteredUrl = isRegisteredIp || isRegisteredOrigin;
//       // console.log('isRegisteredUrl', isRegisteredUrl);
//       // console.log('ipAddress', ipAddress);

//       const isDevelopmentEnv = this.conf.get('NODE_ENV') === 'development';
//       // console.log('isDevelopmentEnv', isDevelopmentEnv);
//       const isDevOrigin = isDevelopmentEnv && ['::ffff:172.18.0.1'].includes(ipAddress);
//       // console.log(`['::ffff:172.18.0.1'].includes(ipAddress)`, ['::ffff:172.18.0.1'].includes(ipAddress));

//       if (!isRegisteredUrl && !isDevelopmentEnv) {
//         throw new UnauthorizedException(`Invalid Credential Provided / Not Registered Client`);
//       }
//       // Check Key
//       if (!isApiKeyMatch(client.keyHash, key)) {
//         throw new UnauthorizedException(`Invalid Credential Provided`);
//       }

//       // Client Not Active
//       if (!client.isActive) {
//         throw new UnauthorizedException(`Unauthorized access using inactive client`);
//       }
//       // User Not activated
//       if (existingUser.status === UserStatus.PENDING) {
//         return {
//           success: false,
//           message: `Account not verified. Please verify your OTP code`,
//           statusCode: 412, // 'OTP_NOT_VERIFIED',
//           user: existingUser,
//         };
//       }
//       // User Blocked / Suspended
//       if ([UserStatus.BLOCKED, UserStatus.SUSPENDED].includes(existingUser.status)) {
//         return {
//           success: false,
//           message: `Account is blocked or suspended`,
//           statusCode: 413, //'ACCOUNT_SUSPENDED_OR_BLOCKED',
//         };
//       }

//       // device detect...
//       //   const ua = formatUserAgent(userAgent, existingUser.id);
//       //   const { deviceHash } = ua;
//       //   const accessDevice = userAccess?.accessDevices.find((o) => o.deviceHash === deviceHash);

//       await queryRunner.commitTransaction();

//       return {
//         success: true,
//         message: `Login Successful`,
//         statusCode: 200, //'OK',
//         user: existingUser,
//       };
//     } catch (error) {
//       await queryRunner.rollbackTransaction();
//       if (error.status === HttpStatus.BAD_REQUEST || error.status === HttpStatus.UNAUTHORIZED || error.status === HttpStatus.NOT_FOUND) {
//         throw error;
//       } else {
//         throw new HttpException(error?.message || error, error?.status || HttpStatus.INTERNAL_SERVER_ERROR);
//       }
//     } finally {
//       await queryRunner.release();
//     }
//   }
// }
