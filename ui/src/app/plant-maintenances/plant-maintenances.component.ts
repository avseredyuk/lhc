import {Component, OnInit, ViewChildren, QueryList, Renderer} from "@angular/core";
import {Router} from "@angular/router";
import {DataService} from "../data.service";
import {PlantMaintenance} from "../model/plant-maintenance";
import {AppNotification} from "../model/app-notification";
import {ComponentCommunicationService} from "../component-communication.service";

@Component({
  selector: 'app-plant-maintenances',
  templateUrl: './plant-maintenances.component.html',
  styleUrls: ['./plant-maintenances.component.scss']
})
export class PlantMaintenancesComponent implements OnInit {

  notifications: Array<AppNotification> = [];
  objectKeys = Object.keys;
  plantMaintenances = Object;
  @ViewChildren('tabHeader') tabHeaders: QueryList<any>;
  @ViewChildren('actualTab') actualTabs: QueryList<any>;

  constructor(private router: Router, private dataService: DataService, private renderer: Renderer, private componentCommunicationService: ComponentCommunicationService) { }

  ngOnInit() {
    if (!window.localStorage.getItem('token')) {
      this.router.navigate(['login']);
      return;
    }

    this.dataService.getPlantMaintenances().subscribe(
  		data => this.plantMaintenances = data
  	);

  	this.notifications = this.componentCommunicationService.data;
  	this.componentCommunicationService.data = [];
  }

  onTabHeadClick(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var value = target.attributes.id.nodeValue;
    this.tabHeaders.forEach((e) => {
    	if (e !== undefined) {
    		if (e.nativeElement.classList.contains("active")) {
				e.nativeElement.classList.remove("active");
    		}
    		if (e.nativeElement.id === value) {
    			e.nativeElement.classList.add("active");
    		}
        }
    });
    this.actualTabs.forEach((e) => {
    	if (e !== undefined) {
    		if (e.nativeElement.classList.contains("active")) {
				e.nativeElement.classList.remove("active");
    		}
    		if (e.nativeElement.id === value) {
    			e.nativeElement.classList.add("active");
    		}
    	}
    });
  }

  deleteMaintenance(deviceName: string, plantMaintenance: PlantMaintenance) {
  	this.dataService.deletePlantMaintenance(plantMaintenance).subscribe(
      data => {
      	this.plantMaintenances[deviceName].maintenances = this.plantMaintenances[deviceName].maintenances.filter((pm) => {return pm.id !== plantMaintenance.id});
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
