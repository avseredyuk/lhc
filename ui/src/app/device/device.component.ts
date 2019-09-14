import {Component, OnInit} from "@angular/core";
import {DataService} from "../data.service";
import {ComponentCommunicationService} from "../component-communication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Device, DeviceReportDataExclusion} from "../model/device";
import {ApiResult} from "../model/api-result";
import {AppNotification, AppNotificationType} from "../model/app-notification";

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {

  notifications: Array<AppNotification> = [];
  device: Device;

  constructor(private router: Router, private dataService: DataService, private componentCommunicationService: ComponentCommunicationService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => this.device = params.id)
  }

  ngOnInit() {
    if (!window.localStorage.getItem('token')) {
      this.router.navigate(['login']);
      return;
    }
    this.dataService.getDevice(this.device).subscribe(
      (data: ApiResult<Device>) => {
        this.device = data.data;
      },
      error => { // HttpErrorResponse
        if (error.status === 404) {
          this.componentCommunicationService.data.push(new AppNotification('Device not found', AppNotificationType.ERROR));
        } else {
          this.componentCommunicationService.data.push(new AppNotification('Unknown error', AppNotificationType.ERROR));
        }
        this.router.navigate(['devices']);
      }
    );
  }

  enableRunPumpOnce() {
  	if (confirm('Are you sure you want to run pump for device "' + this.device.name + '" ?')) {
      this.dataService.enableRunPumpOnce(this.device).subscribe(
        (data: ApiResult<Device>) => {
          this.notifications = [new AppNotification('Pump enabled', AppNotificationType.SUCCESS)];
        },
        error => { // HttpErrorResponse
          if (error.status === 400) {
            this.notifications = error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)});
          } else {
            this.notifications = [new AppNotification('Unknown error', AppNotificationType.ERROR)];
          }
        }
      );
    }
  }

  hasNotifications(): Boolean {
    return this.notifications.length > 0;
  }

  hasConfig(): Boolean {
    return this.device.config && this.device.config.length > 0;
  }

  hasExclusions(): Boolean {
    return this.device.exclusions && this.device.exclusions.length > 0;
  }

  checkExcluded(exclusion: DeviceReportDataExclusion): boolean {
    return exclusion.excluded;
  }

}
