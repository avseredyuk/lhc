import {Component, OnInit, ViewChild} from "@angular/core";
import {DataService} from "../data.service";
import {ComponentCommunicationService} from "../component-communication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Device, DeviceReportDataExclusion} from "../model/device";
import {ApiResult} from "../model/api-result";
import {AppNotification, AppNotificationType} from "../model/app-notification";
import {TokenCheckService} from "../token-check.service";
import {SidebarComponent} from "../sidebar/sidebar.component";

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  notifications: Array<AppNotification> = [];
  deviceId: number;
  device: Device = new Device();

  constructor(private router: Router, private dataService: DataService, private componentCommunicationService: ComponentCommunicationService,
    private route: ActivatedRoute, private tokenCheckService: TokenCheckService) {
    this.route.params.subscribe(params => this.deviceId = params.id)
  }

  ngOnInit() {
    if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
      return;
    }
    this.sidebar.setGoBackCallback(() => {this.router.navigate(['devices']);});
    this.loadDevice();
  }

  loadDevice() {
    this.dataService.getDevice(this.deviceId).subscribe(
      (data: ApiResult<Device>) => {
        this.device = data.data;
      },
      error => {
        if (error.status === 404) {
          this.componentCommunicationService.setNotification([new AppNotification('Device not found', AppNotificationType.ERROR)]);
        } else {
          this.componentCommunicationService.setNotification([new AppNotification('Unknown error', AppNotificationType.ERROR)]);
        }
        this.router.navigate(['devices']);
      }
    );
  }

  enableRunPumpOnce() {
  	if (confirm('Are you sure you want to run pump for device "' + this.device.name + '" ?')) {
      this.dataService.enableRunPumpOnce(this.deviceId).subscribe(
        (data: ApiResult<Boolean>) => {
          this.notifications = [new AppNotification('Pump enabled', AppNotificationType.SUCCESS)];
          this.loadDevice();
        },
        error => {
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

}
