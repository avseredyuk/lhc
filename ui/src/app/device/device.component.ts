import {Component, OnInit} from "@angular/core";
import {DataService} from "../data.service";
import {ComponentCommunicationService} from "../component-communication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Device, DeviceReportDataExclusion} from "../model/device";
import {ApiResult} from "../model/api-result";
import {AppNotification, AppNotificationType} from "../model/app-notification";
import {Location} from '@angular/common';
import {TokenCheckService} from "../token-check.service";

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {

  notifications: Array<AppNotification> = [];
  device: Device;

  constructor(private router: Router, private dataService: DataService, private componentCommunicationService: ComponentCommunicationService,
    private route: ActivatedRoute, private location: Location, private tokenCheckService: TokenCheckService) {
    this.route.params.subscribe(params => this.device = params.id)
  }

  ngOnInit() {
    if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
      return;
    }
    this.dataService.getDevice(this.device).subscribe(
      (data: ApiResult<Device>) => {
        this.device = data.data;
      },
      error => { // HttpErrorResponse
        if (error.status === 404) {
          this.componentCommunicationService.setValue("notification", new AppNotification('Device not found', AppNotificationType.ERROR));
        } else {
          this.componentCommunicationService.setValue("notification", new AppNotification('Unknown error', AppNotificationType.ERROR));
        }
        this.router.navigate(['devices']);
      }
    );
  }

  enableRunPumpOnce() {
  	if (confirm('Are you sure you want to run pump for device "' + this.device.name + '" ?')) {
      this.dataService.enableRunPumpOnce(this.device).subscribe(
        (data: ApiResult<Boolean>) => {
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

  //todo: not used right now but should be
  hasConfig(): Boolean {
    return this.device.config && this.device.config.length > 0;
  }

  //todo: not used right now but should be
  hasExclusions(): Boolean {
    return this.device.exclusions && this.device.exclusions.length > 0;
  }

  checkExcluded(exclusion: DeviceReportDataExclusion): boolean {
    return exclusion.excluded;
  }

}
