import {BaseAuth} from "../../base/base-auth";
import {Component, OnInit, ViewChild} from "@angular/core";
import {DataService} from "../../service/data.service";
import {ComponentCommunicationService} from "../../service/component-communication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Device} from "../../model/device";
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
export class DeviceViewComponent extends BaseAuth implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  deviceId: number;
  device: Device = new Device();

  constructor(public router: Router, private dataService: DataService, public componentCommunicationService: ComponentCommunicationService,
    private route: ActivatedRoute, public tokenCheckService: TokenCheckService, public utilService: UtilService) {
    super(router, componentCommunicationService, tokenCheckService);
    this.route.params.subscribe(params => this.deviceId = params.id)
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.sidebar.setGoBackCallback(() => this.router.navigate(['devices']));
    this.loadDevice();
  }

  loadDevice(): void {
    this.dataService.getDevice(this.deviceId).subscribe(
      (data: ApiResult<Device>) => {
        this.device = data.data;
      },
      error => {
        let errNotification;
        if (error.status === 404) {
          errNotification = [new AppNotification('Device not found', AppNotificationType.ERROR)];
        } else {
          errNotification = [new AppNotification('Unknown error', AppNotificationType.ERROR)];
        }
        this.navigateWithNotification(['devices'], errNotification);
      }
    );
  }

  enableRunPumpOnce(): void {
  	if (confirm('Are you sure you want to run pump for device "' + this.device.name + '" ?')) {
      this.dataService.enableRunPumpOnce(this.deviceId).subscribe((data: ApiResult<boolean>) => {
        this.notificateThisPage([new AppNotification('Pump enabled', AppNotificationType.SUCCESS)]);
        this.loadDevice();
      }, error => {
        if (error.status === 400) {
          this.notificateThisPage(error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)}));
        } else {
          this.notificateThisPage([new AppNotification('Unknown error', AppNotificationType.ERROR)]);
        }
      });
    }
  }

  hasConfig(): boolean {
    return this.device.config && this.device.config.length > 0;
  }

  hasExclusions(): boolean {
    return this.device.exclusions && this.device.exclusions.length > 0;
  }

  hasNotes(): boolean {
    return this.device.notes != null && this.device.notes.length > 0;
  }

}
