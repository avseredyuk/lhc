import {Component, OnInit} from "@angular/core";
import {DataService} from "../data.service";
import {ComponentCommunicationService} from "../component-communication.service";
import {Router} from "@angular/router";
import {Device} from "../model/device";
import {AppNotification} from "../model/app-notification";

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {

  notifications: Array<AppNotification> = [];
  devices: Device[];

  constructor(private router: Router, private dataService: DataService, private componentCommunicationService: ComponentCommunicationService) { }

  ngOnInit() {
    if (!window.localStorage.getItem('token')) {
      this.router.navigate(['login']);
      return;
    }

    this.dataService.getDevices().subscribe(
  		data => this.devices = data
  	);

    this.notifications = this.componentCommunicationService.data;
    this.componentCommunicationService.data = [];
  }

  hasNotifications(): Boolean {
    return this.notifications.length > 0;
  }

}
