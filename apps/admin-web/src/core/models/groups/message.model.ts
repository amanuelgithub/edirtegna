export interface Message {
  groupId: number;
  userId: number;
  messageText: string;
  messageDate: Date;
  replies?: Message[];
}
