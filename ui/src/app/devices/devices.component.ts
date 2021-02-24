import {Component, OnInit} from "@angular/core";
import {DataService} from "../data.service";
import {ComponentCommunicationService} from "../component-communication.service";
import {Router} from "@angular/router";
import {Device} from "../model/device";
import {AppNotification, AppNotificationType} from "../model/app-notification";
import {TokenCheckService} from "../token-check.service";
import {UtilService} from "../util.service";

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {

  notifications: Array<AppNotification> = [];
  devices: Device[];

  constructor(private router: Router, private dataService: DataService, private componentCommunicationService: ComponentCommunicationService,
    private tokenCheckService: TokenCheckService, public utilService: UtilService) { }

  ngOnInit() {
    if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
      return;
    }

    this.loadData();

    this.notifications = this.componentCommunicationService.getNotification();
  }

  loadData() {
    this.dataService.getDevices().subscribe(
      data => this.devices = data
    );
  }

  deleteDevice(device: Device) {
    if (confirm('Are you sure you want to delete device "' + device.name + '" ?')) {
      this.dataService.deleteDevice(device).subscribe(
        data => {
          this.notifications = [new AppNotification('Deleted device: ' + device.name, AppNotificationType.SUCCESS)];
          this.loadData();
        },
        error => {
          if (error.status === 400) {
            this.notifications = error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)});
          } else {
            this.notifications = [new AppNotification('Unknown error', AppNotificationType.ERROR)];
          }
          this.loadData();
        }
       );
    }
  }

  hasData(): Boolean {
    return typeof this.devices !== 'undefined' && this.devices.length > 0;
  }

  hasNotifications(): Boolean {
    return typeof this.notifications !== 'undefined' && this.notifications.length > 0;
  }

}
