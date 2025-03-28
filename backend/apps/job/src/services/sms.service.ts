import { getPhoneFormatForSMSgw, ISMSPayload, ISMSResponse } from '@app/shared';
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { catchError, map, Observable } from 'rxjs';

@Injectable()
export class SMSService {
  private smsApiUri: string;
  private smsApiKey: string;
  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
    const apiConfig = this.configService.get('sms');
    this.smsApiUri = apiConfig.smsApiUri;
    this.smsApiKey = apiConfig.smsApiKey;
  }

  /*
  ******************************* 
  SEND SMS
  *******************************
  */

  public sendSms(payload: ISMSPayload): Observable<AxiosResponse<ISMSResponse>> {
    const headers = { 'Content-type': 'application/json', 'X-API-KEY': `${this.smsApiKey}` };
    const to = getPhoneFormatForSMSgw(payload.to);
    return this.httpService.post(`${this.smsApiUri}`, { ...payload, to }, { headers }).pipe(
      map((response) => response as AxiosResponse<ISMSResponse>),
      catchError((err) => {
        Logger.log(`Couldn't Connect to SMS Service, Error: ${err}`);
        const errResponse = {
          Code: 503,
          ValidationResults: {
            Errors: ['SMS Service Unavailable'],
            Warnings: [],
          },
        };
        throw new HttpException(errResponse, HttpStatus.SERVICE_UNAVAILABLE);
      }),
    );
  }
}
