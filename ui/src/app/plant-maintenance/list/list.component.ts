import {BaseComponent} from "../../base/base.component";
import {Component, OnInit, ViewChild, Renderer2} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../service/data.service";
import {PlantMaintenance} from "../../model/plant-maintenance";
import {ComponentCommunicationService} from "../../service/component-communication.service";
import {TokenCheckService} from "../../service/token-check.service";
import {UtilService} from "../../service/util.service";
import {ApiResult} from "../../model/api-result";
import {SidebarComponent} from "../../parts/sidebar/sidebar.component";

@Component({
  selector: 'app-plant-maintenance-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class PlantMaintenanceListComponent extends BaseComponent implements OnInit {
  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  plantMaintenancesForDevice: Array<PlantMaintenance> = [];
  deviceId: number;
  pageNumber: number = 1;
  totalPages: number;

  constructor(public router: Router, private dataService: DataService, private renderer: Renderer2,
    private route: ActivatedRoute, public componentCommunicationService: ComponentCommunicationService,
    private tokenCheckService: TokenCheckService, public utilService: UtilService) {
    super(router, componentCommunicationService);
    this.route.params.subscribe(params => this.deviceId = params.id)
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
      return;
    }
    this.sidebar.setGoBackCallback(() => {this.router.navigate(['devices/' + this.deviceId]);});

    const storedPageNumber = this.componentCommunicationService.getPageNumber(this.constructor.name);
    if (storedPageNumber !== undefined) {
      this.pageNumber = storedPageNumber;
    }

    this.loadPageForDevice();
  }

  loadPageForDevice(): void {
    this.dataService.getPlantMaintenancesByDeviceId(this.deviceId, this.pageNumber - 1).subscribe(maintenances => {
      this.plantMaintenancesForDevice = maintenances.content;
      this.totalPages = maintenances.totalPages;
    });
  }

  loadPage(p: number): void {
    this.pageNumber = p;
    this.loadPageForDevice();
  }

  deleteMaintenance(plantMaintenance: PlantMaintenance): void {
    if (confirm('Are you sure you want to delete plant maintenance?')) {
      this.dataService.deletePlantMaintenance(plantMaintenance).subscribe(data => {
        this.loadPageForDevice();
      });
    }
  }

  addPlantMaintenance(): void {
    this.componentCommunicationService.setPageNumber(this.constructor.name, this.pageNumber);
    this.router.navigate(['devices/' + this.deviceId + '/maintenance/add']);
  }

  editPlantMaintenance(maintenanceId: number): void {
    this.componentCommunicationService.setPageNumber(this.constructor.name, this.pageNumber);
    this.router.navigate(['devices/' + this.deviceId + '/maintenance/' + maintenanceId + '/edit']);
  }

  cloneMaintenance(plantMaintenance: PlantMaintenance): void {
    this.dataService.getPlantMaintenance(plantMaintenance.deviceId, plantMaintenance.id).subscribe(
      (data: ApiResult<PlantMaintenance>) => {
        this.componentCommunicationService.setClonedMaintenance(data.data);
        this.componentCommunicationService.setPageNumber(this.constructor.name, this.pageNumber);
        this.router.navigate(['devices/' + plantMaintenance.deviceId + '/maintenance/add']);
      });
  }

  hasData(): boolean {
    return typeof this.plantMaintenancesForDevice !== 'undefined' && this.plantMaintenancesForDevice.length > 0;
  }
}
