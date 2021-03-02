export class AppNotification {
  message: string;
  type: AppNotificationType;

  constructor(message: string, type: AppNotificationType) {
  	this.message = message;
  	this.type = type;
  }

  isError(): boolean {
  	return this.type === AppNotificationType.ERROR;
  }
}

export enum AppNotificationType {
  ERROR, SUCCESS
}