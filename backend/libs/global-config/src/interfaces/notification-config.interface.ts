export interface INotificationConfig {
  isSmsNotificationInSimulation: boolean;
  smsNotificationSimulationDestinations: string[];
  companySmsAlertDestinations: string[];
  sendSmsOnTelebirrApiFailure: boolean;
  sendSmsOnAuditMismatchDetection: boolean;
}
