import {AppNotification} from "../model/app-notification";
import {OnInit} from '@angular/core';
import {Injectable} from "@angular/core";
import {ComponentCommunicationService} from "../service/component-communication.service";
import {Router} from "@angular/router";

@Injectable()
export class Base implements OnInit {
 
  public notifications: Array<AppNotification> = [];

  constructor(public router: Router, public componentCommunicationService: ComponentCommunicationService) { }

  ngOnInit(): void {
  	this.notifications = this.componentCommunicationService.getNotification();
  }

  public hasNotifications(): boolean {
    return typeof this.notifications !== 'undefined' && this.notifications.length > 0;
  }

  public notificateThisPage(notifications: Array<AppNotification>): void {
  	this.notifications = notifications;
  }

  public navigateWithNotification(path: any[], notifications: Array<AppNotification>): void {
  	this.componentCommunicationService.setNotification(notifications);
    this.router.navigate([path]);
  }

}
