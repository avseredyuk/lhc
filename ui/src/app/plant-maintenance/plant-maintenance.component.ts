import {Component, OnInit, ViewChildren, QueryList, Renderer} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../data.service";
import {PlantMaintenance} from "../model/plant-maintenance";
import {AppNotification} from "../model/app-notification";
import {Device} from "../model/device";
import {ComponentCommunicationService} from "../component-communication.service";
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-plant-maintenance',
  templateUrl: './plant-maintenance.component.html',
  styleUrls: ['./plant-maintenance.component.scss']
})
export class PlantMaintenanceComponent implements OnInit {

  notifications: Array<AppNotification> = [];
  pages: Array<number> = [];
  // plantMaintenances: Map<number, Array<PlantMaintenance>> = new Map();
  plantMaintenancesForDevice: Array<PlantMaintenance> = [];
  deviceId: number;
  // activeDevice: Device = new Device();
  pageNumber: number = 1;
  @ViewChildren('tabHeader') tabHeaders: QueryList<any>;

  constructor(private router: Router, private dataService: DataService, private renderer: Renderer,
    private route: ActivatedRoute, private componentCommunicationService: ComponentCommunicationService) {
    this.route.params.subscribe(params => this.deviceId = params.id) 
  }

  ngOnInit() {
    if (!window.localStorage.getItem('token')) {
      this.router.navigate(['login']);
      return;
    }

    this.loadPageForDevice();

  	this.notifications = this.componentCommunicationService.data;
  	this.componentCommunicationService.data = [];
  }

  loadPageForDevice() {
    this.dataService.getPlantMaintenancesByDeviceId(this.deviceId, this.pageNumber - 1).subscribe(
      maintenances => {
        this.plantMaintenancesForDevice = maintenances.content;

        this.pages = [];
        for (var i = 1; i <= maintenances.totalPages; i++) {
          this.pages.push(i);
        }
      }
    );
  }

  isCurrentPage(p) {
    return p == this.pageNumber;
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

  //todo: same as in status component!
  formatTimestamp(timestamp: number): string {
		var localeId = 'uk-UA';
		return new Date(timestamp).toLocaleString(localeId);
  }

  hasNotifications(): Boolean {
    return this.notifications.length > 0;
  }
}
