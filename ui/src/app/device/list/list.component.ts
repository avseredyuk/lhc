import {BaseComponent} from "../../base/base.component";
import {Component, OnInit} from "@angular/core";
import {DataService} from "../../service/data.service";
import {ComponentCommunicationService} from "../../service/component-communication.service";
import {Router} from "@angular/router";
import {Device} from "../../model/device";
import {AppNotification, AppNotificationType} from "../../model/app-notification";
import {TokenCheckService} from "../../service/token-check.service";
import {UtilService} from "../../service/util.service";

@Component({
  selector: 'app-device-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class DeviceListComponent extends BaseComponent implements OnInit {

  devices: Device[];

  constructor(public router: Router, private dataService: DataService, public componentCommunicationService: ComponentCommunicationService,
    private tokenCheckService: TokenCheckService, public utilService: UtilService) {
    super(router, componentCommunicationService);
  }

  ngOnInit() {
    super.ngOnInit();
    if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
      return;
    }

    this.loadData();
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
          this.notificateThisPage([new AppNotification('Deleted device: ' + device.name, AppNotificationType.SUCCESS)]);
          this.loadData();
        },
        error => {
          if (error.status === 400) {
            this.notificateThisPage(error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)}));
          } else {
            this.notificateThisPage([new AppNotification('Unknown error', AppNotificationType.ERROR)]);
          }
          this.loadData();
        }
       );
    }
  }

  addDevice() {
    this.router.navigate(['devices/add']);
  }

  hasData(): Boolean {
    return typeof this.devices !== 'undefined' && this.devices.length > 0;
  }

}
