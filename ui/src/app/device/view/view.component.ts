import {BaseComponent} from "../../base/base.component";
import {Component, OnInit, ViewChild} from "@angular/core";
import {DataService} from "../../service/data.service";
import {ComponentCommunicationService} from "../../service/component-communication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Device, DeviceReportDataExclusion} from "../../model/device";
import {ApiResult} from "../../model/api-result";
import {AppNotification, AppNotificationType} from "../../model/app-notification";
import {TokenCheckService} from "../../service/token-check.service";
import {SidebarComponent} from "../../parts/sidebar/sidebar.component";
import {UtilService} from "../../service/util.service";

@Component({
  selector: 'app-device-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class DeviceViewComponent extends BaseComponent implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  deviceId: number;
  device: Device = new Device();

  constructor(public router: Router, private dataService: DataService, public componentCommunicationService: ComponentCommunicationService,
    private route: ActivatedRoute, private tokenCheckService: TokenCheckService, public utilService: UtilService) {
    super(router, componentCommunicationService);
    this.route.params.subscribe(params => this.deviceId = params.id)
  }

  ngOnInit() {
    super.ngOnInit();
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
        var errNotification;
        if (error.status === 404) {
          errNotification = [new AppNotification('Device not found', AppNotificationType.ERROR)];
        } else {
          errNotification = [new AppNotification('Unknown error', AppNotificationType.ERROR)];
        }
        this.navigateWithNotification('devices', errNotification);
      }
    );
  }

  enableRunPumpOnce() {
  	if (confirm('Are you sure you want to run pump for device "' + this.device.name + '" ?')) {
      this.dataService.enableRunPumpOnce(this.deviceId).subscribe(
        (data: ApiResult<Boolean>) => {
          this.notificateThisPage([new AppNotification('Pump enabled', AppNotificationType.SUCCESS)]);
          this.loadDevice();
        },
        error => {
          if (error.status === 400) {
            this.notificateThisPage(error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)}));
          } else {
            this.notificateThisPage([new AppNotification('Unknown error', AppNotificationType.ERROR)]);
          }
        }
      );
    }
  }

  hasConfig(): Boolean {
    return this.device.config && this.device.config.length > 0;
  }

  hasExclusions(): Boolean {
    return this.device.exclusions && this.device.exclusions.length > 0;
  }

  hasNotes(): Boolean {
    return this.device.notes != null && this.device.notes.length > 0;
  }

}
