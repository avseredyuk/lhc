import {Component, OnInit, ViewChildren, QueryList, Renderer, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../data.service";
import {PlantMaintenance} from "../model/plant-maintenance";
import {AppNotification} from "../model/app-notification";
import {Device} from "../model/device";
import {ComponentCommunicationService} from "../component-communication.service";
import {tap} from "rxjs/operators";
import {TokenCheckService} from "../token-check.service";
import {UtilService} from "../util.service";
import {ApiResult} from "../model/api-result";
import {SidebarComponent} from "../sidebar/sidebar.component";

@Component({
  selector: 'app-plant-maintenance',
  templateUrl: './plant-maintenance.component.html',
  styleUrls: ['./plant-maintenance.component.scss']
})
export class PlantMaintenanceComponent implements OnInit {
  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  notifications: Array<AppNotification> = [];
  plantMaintenancesForDevice: Array<PlantMaintenance> = [];
  deviceId: number;
  pageNumber: number = 1;
  totalPages: number;
  @ViewChildren('tabHeader') tabHeaders: QueryList<any>;
  deviceName: string;

  constructor(private router: Router, private dataService: DataService, private renderer: Renderer,
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
    this.loadPageForDevice();

  	this.notifications = this.componentCommunicationService.getValue("notification");
    this.dataService.getDevice(this.deviceId).subscribe(
      apiResult => this.deviceName = apiResult.data.name
    );
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
  	this.dataService.deletePlantMaintenance(plantMaintenance).subscribe(
      data => {
        this.loadPageForDevice();
      }
    );
  }

  cloneMaintenance(plantMaintenance: PlantMaintenance) {
    this.dataService.getPlantMaintenance(plantMaintenance.deviceId, plantMaintenance.id).subscribe(
      (data: ApiResult<PlantMaintenance>) => {
        this.componentCommunicationService.setValue("clonedMaintenance", data.data);
        this.router.navigate(['/add-plant-maintenance/' + plantMaintenance.deviceId]);
      });
  }

  hasNotifications(): Boolean {
    return typeof this.notifications !== 'undefined' && this.notifications.length > 0;
  }
}