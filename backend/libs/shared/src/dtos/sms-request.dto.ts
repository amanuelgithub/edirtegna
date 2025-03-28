export interface ISMSPayload {
  to: string;
  text: string;
  subject?: string;
  userId?: number;
}
export interface IRetrySMSPayload {
  id: number;
}
export interface ISMSNotifier {
  getData(): ISMSPayload;
  updateDestination?(phone: string): void;
}
export class SMSPayloadDto {
  to: string;
  text: string;
  subject?: string;
  userId?: number;
  constructor(data: ISMSPayload) {
    this.to = data.to;
    this.text = data.text;
    this.subject = data.subject;
    this.userId = data.userId;
  }
}

export interface ISMSResponse {
  error: number;
  Desc: string;
}
export class SMSResponseDto {
  error: number;
  description: string;
  constructor(data: ISMSResponse) {
    this.error = data.error;
    this.description = data.Desc;
  }
}
