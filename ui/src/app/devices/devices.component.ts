import {Component, OnInit} from "@angular/core";
import {DataService} from "../data.service";
import {ComponentCommunicationService} from "../component-communication.service";
import {Router} from "@angular/router";
import {Device} from "../model/device";
import {AppNotification} from "../model/app-notification";
import {TokenCheckService} from "../token-check.service";

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {

  notifications: Array<AppNotification> = [];
  devices: Device[];

  constructor(private router: Router, private dataService: DataService, private componentCommunicationService: ComponentCommunicationService,
    private tokenCheckService: TokenCheckService) { }

  ngOnInit() {
    if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
      return;
    }

    this.dataService.getDevices().subscribe(
  		data => this.devices = data
  	);

    this.notifications = this.componentCommunicationService.getNotification();
  }

  hasData(): Boolean {
    return typeof this.devices !== 'undefined' && this.devices.length > 0;
  }

  hasNotifications(): Boolean {
    return typeof this.notifications !== 'undefined' && this.notifications.length > 0;
  }

}
