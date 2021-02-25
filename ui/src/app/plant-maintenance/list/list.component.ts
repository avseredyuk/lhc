import { Component, OnInit, ViewChildren, QueryList, ViewChild, Renderer2 } from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../service/data.service";
import {PlantMaintenance} from "../../model/plant-maintenance";
import {AppNotification} from "../../model/app-notification";
import {Device} from "../../model/device";
import {ComponentCommunicationService} from "../../service/component-communication.service";
import {tap} from "rxjs/operators";
import {TokenCheckService} from "../../service/token-check.service";
import {UtilService} from "../../service/util.service";
import {ApiResult} from "../../model/api-result";
import {SidebarComponent} from "../../sidebar/sidebar.component";

@Component({
  selector: 'app-plant-maintenance-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class PlantMaintenanceListComponent implements OnInit {
  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  notifications: Array<AppNotification> = [];
  plantMaintenancesForDevice: Array<PlantMaintenance> = [];
  deviceId: number;
  pageNumber: number = 1;
  totalPages: number;
  @ViewChildren('tabHeader') tabHeaders: QueryList<any>;

  constructor(private router: Router, private dataService: DataService, private renderer: Renderer2,
    private route: ActivatedRoute, private componentCommunicationService: ComponentCommunicationService,
    private tokenCheckService: TokenCheckService, public utilService: UtilService) {
    this.route.params.subscribe(params => this.deviceId = params.id)
  }

  ngOnInit() {
    if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
      return;
    }
    this.sidebar.setGoBackCallback(() => {this.router.navigate(['devices/' + this.deviceId]);});

    let storedPageNumber = this.componentCommunicationService.getPageNumber(this.constructor.name);
    if (storedPageNumber !== undefined) {
      this.pageNumber = storedPageNumber;
    }

    this.loadPageForDevice();

  	this.notifications = this.componentCommunicationService.getNotification();
  }

  loadPageForDevice() {
    this.dataService.getPlantMaintenancesByDeviceId(this.deviceId, this.pageNumber - 1).subscribe(
      maintenances => {
        this.plantMaintenancesForDevice = maintenances.content;
        this.totalPages = maintenances.totalPages;
      }
    );
  }

  loadPage(p) {
    this.pageNumber = p;
    this.loadPageForDevice();
  }

  deleteMaintenance(plantMaintenance: PlantMaintenance) {
    if (confirm('Are you sure you want to delete plant maintenance?')) {
      this.dataService.deletePlantMaintenance(plantMaintenance).subscribe(
        data => {
          this.loadPageForDevice();
        }
        );
    }
  }

  addPlantMaintenance() {
    this.componentCommunicationService.setPageNumber(this.constructor.name, this.pageNumber);
    this.router.navigate(['devices/' + this.deviceId + '/maintenance/add']);
  }

  editPlantMaintenance(maintenanceId: number) {
    this.componentCommunicationService.setPageNumber(this.constructor.name, this.pageNumber);
    this.router.navigate(['devices/' + this.deviceId + '/maintenance/' + maintenanceId + '/edit']);
  }

  cloneMaintenance(plantMaintenance: PlantMaintenance) {
    this.dataService.getPlantMaintenance(plantMaintenance.deviceId, plantMaintenance.id).subscribe(
      (data: ApiResult<PlantMaintenance>) => {
        this.componentCommunicationService.setClonedMaintenance(data.data);
        this.componentCommunicationService.setPageNumber(this.constructor.name, this.pageNumber);
        this.router.navigate(['devices/' + plantMaintenance.deviceId + '/maintenance/add']);
      });
  }

  hasData(): Boolean {
    return typeof this.plantMaintenancesForDevice !== 'undefined' && this.plantMaintenancesForDevice.length > 0;
  }

  hasNotifications(): Boolean {
    return typeof this.notifications !== 'undefined' && this.notifications.length > 0;
  }
}
