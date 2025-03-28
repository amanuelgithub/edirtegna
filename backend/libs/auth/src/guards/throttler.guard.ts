/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  // protected getTracker(req: Record<string, any>): string {
  //   console.log(req.ips, '---', req.ip);
  //   return req.ips.length ? req.ips[0] : req.ip; // individualize IP extraction to meet your own needs
  // }
  // protected throwThrottlingException(context: ExecutionContext): void {
  //   const msg = this.errorMessage;
  //   throw new ThrottlerException('Too many requests...');
  // }
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // return req.ips.length ? req.ips[0] : req.ip;
    // The `getTracker` method is correctly using the `req.ip` property to get the client's IP address.
    // This property is set by Express when the `trust proxy` setting is enabled, and it correctly handles the `X-Forwarded-For` header.

    // However, the `req.ips` property is an array that contains the IP addresses from the `X-Forwarded-For` header.
    // If there are multiple IP addresses in this header, `req.ips` will contain all of them, with the client's IP address being the first one in the array.

    // If you're only interested in the client's IP address, you can continue to use `req.ip` (as above).
    // If you want to get all the IP addresses from the `X-Forwarded-For` header, you can use `req.ips`.

    // In this version of the method, if `req.ips` contains multiple IP addresses, they are joined into a single string with commas in between.
    // If `req.ips` is empty, `req.ip` is used.
    // Please note that this will only work correctly if the `trust proxy` setting is enabled in your Express application.
    return req.ips.length ? req.ips.join(', ') : req.ip;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async throwThrottlingException(context: ExecutionContext, throttlerLimitDetail): Promise<void> {
    throw new ThrottlerException('Your custom rate limit exceeded message');
  }

  //////
  // to get message... with retry after...
  // async handleRequest(context: ExecutionContext, limit: number, ttl: number): Promise<boolean> {
  //   const client = this.getRequestResponse(context)[0];
  //   const key = this.generateKey(context, this.getTracker(client));
  //   const ttls = await this.storageService.getRecord(key);

  //   if (ttls.length >= limit) {
  //     const retryAfter = Math.ceil((ttls[0] - Date.now()) / 1000);
  //     throw new ThrottlerException(`Rate limit exceeded. Try again in ${retryAfter} seconds.`);
  //   }

  //   return true;
  // }
}
//====================================
// @Injectable()
// export class AppThrottlerGuard extends ThrottlerGuard {
//   private requestCount: Record<string, number> = {};

//   generateKey(context: ExecutionContext, tracker: string): string {
//     const request = context.switchToHttp().getRequest();
//     return `${tracker}_${request.method}_${request.url}`;
//   }

//   async getRecord(key: string): Promise<number[]> {
//     const record = await this.storageService.get(key);
//     return record ? record.map((timestamp: number) => timestamp - Date.now()) : [];
//   }

//   async handleRequest(context: ExecutionContext, limit: number, ttl: number): Promise<boolean> {
//     const client = this.getRequestResponse(context)[0];
//     const tracker = await this.getTracker(client);
//     const key = this.generateKey(context, tracker);
//     const ttls = await this.getRecord(key);

//     if (!this.requestCount[key]) {
//       this.requestCount[key] = 1;
//     } else {
//       this.requestCount[key]++;
//     }

//     let retryAfter;
//     if (this.requestCount[key] === 1) {
//       retryAfter = 15;
//     } else if (this.requestCount[key] === 2) {
//       retryAfter = 30;
//     } else {
//       retryAfter = 300; // 5 minutes
//     }

//     if (ttls.length >= limit) {
//       throw new ThrottlerException(`Rate limit exceeded. Try again in ${retryAfter} seconds.`);
//     }

//     return true;
//   }
// }
