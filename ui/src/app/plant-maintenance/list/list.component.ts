import {BasePageableStorable} from "../../base/base-pageable-storable";
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
export class PlantMaintenanceListComponent extends BasePageableStorable<PlantMaintenance> implements OnInit {
  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  deviceId: number;

  constructor(public router: Router, private dataService: DataService, private renderer: Renderer2,
    private route: ActivatedRoute, public componentCommunicationService: ComponentCommunicationService,
    public tokenCheckService: TokenCheckService, public utilService: UtilService) {
    super(utilService.PAGINATED_COMPONENT_PLANT_MAINTENANCE_LIST, router, componentCommunicationService, tokenCheckService);
    this.route.params.subscribe(params => this.deviceId = params.id)
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.sidebar.setGoBackCallback(() => this.router.navigate(['devices', this.deviceId]));
  }

  loadPageData(): void {
    this.dataService.getPlantMaintenancesByDeviceId(this.deviceId, this.pageNumber, this.pageSize).subscribe(maintenances => {
      this.data = maintenances.content;
      this.totalElements = maintenances.totalElements;
    });
  }

  deleteMaintenance(plantMaintenance: PlantMaintenance): void {
    if (confirm('Are you sure you want to delete plant maintenance?')) {
      this.dataService.deletePlantMaintenance(plantMaintenance).subscribe(data => {
        this.loadPageData();
      });
    }
  }

  addPlantMaintenance(): void {
    this.storePaginationInfo();
    this.router.navigate(['devices', this.deviceId, 'maintenance', 'add']);
  }

  editPlantMaintenance(maintenanceId: number): void {
    this.storePaginationInfo();
    this.router.navigate(['devices', this.deviceId, 'maintenance', maintenanceId, 'edit']);
  }

  cloneMaintenance(plantMaintenance: PlantMaintenance): void {
    this.dataService.getPlantMaintenance(plantMaintenance.deviceId, plantMaintenance.id).subscribe(
      (data: ApiResult<PlantMaintenance>) => {
        this.componentCommunicationService.setClonedMaintenance(data.data);
        this.storePaginationInfo();
        this.router.navigate(['devices', plantMaintenance.deviceId, 'maintenance', 'add']);
      });
  }
}
