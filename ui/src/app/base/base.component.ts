import {AppNotification} from "../model/app-notification";
import {Component, OnInit} from '@angular/core';
import {ComponentCommunicationService} from "../service/component-communication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-base',
  template: ''
})
export class BaseComponent implements OnInit {
 
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

  public navigateWithNotification(path: string, notifications: Array<AppNotification>): void {
  	this.componentCommunicationService.setNotification(notifications);
    this.router.navigate([path]);
  }

}
