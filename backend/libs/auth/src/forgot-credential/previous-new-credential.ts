export interface IPreviousAndNewCredential {
  previousCredential: string;
  newCredential: string;
}
export interface IChangeOwnCredential {
  getPreviousAndNewCredential(): IPreviousAndNewCredential;
}
