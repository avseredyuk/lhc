import {BasePageableStorable} from "../../base/base-pageable-storable";
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
export class DeviceListComponent extends BasePageableStorable<Device> implements OnInit {

  constructor(public router: Router, private dataService: DataService, public componentCommunicationService: ComponentCommunicationService,
    public tokenCheckService: TokenCheckService, public utilService: UtilService) {
    super(utilService.PAGINATED_COMPONENT_DEVICE_LIST, router, componentCommunicationService, tokenCheckService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  loadPageData(): void {
    this.dataService.getDevices(this.pageNumber, this.pageSize).subscribe(devices => {
      this.data = devices.content;
      this.totalElements = devices.totalElements;
    });
  }

  deleteDevice(device: Device): void {
    if (confirm('Are you sure you want to delete device "' + device.name + '" ?')) {
      this.dataService.deleteDevice(device).subscribe(data => {
        this.notificateThisPage([new AppNotification('Deleted device: ' + device.name, AppNotificationType.SUCCESS)]);
        this.loadPageData();
      }, error => {
        if (error.status === 400) {
          this.notificateThisPage(error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)}));
        } else {
          this.notificateThisPage([new AppNotification('Unknown error', AppNotificationType.ERROR)]);
        }
        this.loadPageData();
      });
    }
  }

  openDevice(device: Device): void {
    this.componentCommunicationService.setPageNumber(this.utilService.PAGINATED_COMPONENT_DEVICE_LIST, this.pageNumber);
    this.router.navigate(['devices', device.id]);
  }

  addDevice(): void {
    this.componentCommunicationService.setPageNumber(this.utilService.PAGINATED_COMPONENT_DEVICE_LIST, this.pageNumber);
    this.router.navigate(['devices', 'add']);
  }

}
