import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../data.service";
import {PlantMaintenance} from "../model/plant-maintenance";
import {ApiResult} from "../model/api-result";
import {Device} from "../model/device";
import {ComponentCommunicationService} from "../component-communication.service";
import {AppNotification, AppNotificationType} from "../model/app-notification";

@Component({
  selector: 'app-edit-plant-maintenance',
  templateUrl: './edit-plant-maintenance.component.html',
  styleUrls: ['./edit-plant-maintenance.component.scss']
})
export class EditPlantMaintenanceComponent implements OnInit {

  maintenance: PlantMaintenance;
  notifications: Array<AppNotification> = [];
  //todo: same list as in add maintenance - export it to somewhere
  dataTypes: Array<string> = ['FULL', 'SAMPLE', 'PARTIAL'];
  devices: Array<Device>;
  editForm: FormGroup;
  phCtrl: FormControl;
  tdsCtrl: FormControl;
  typeCtrl: FormControl;
  deviceCtrl: FormControl;
  newDetailKeyCtrl: FormControl;
  newDetailValueCtrl: FormControl;

  constructor(private formBuilder: FormBuilder, private router: Router, private dataService: DataService, private route: ActivatedRoute,
  	private componentCommunicationService: ComponentCommunicationService) {
  	this.route.params.subscribe(params => this.maintenance = params.id)
  }

  ngOnInit() {
  	if (!window.localStorage.getItem('token')) {
      this.router.navigate(['login']);
      return;
    }

    this.phCtrl = this.formBuilder.control('', [Validators.required]);
    this.tdsCtrl = this.formBuilder.control('', [Validators.required]);
    this.typeCtrl = this.formBuilder.control('', [Validators.required]);
    this.deviceCtrl = this.formBuilder.control('', [Validators.required]);
    this.newDetailKeyCtrl = this.formBuilder.control('', []);
    this.newDetailValueCtrl = this.formBuilder.control('', []);

    this.editForm = this.formBuilder.group({
    	ph: this.phCtrl,
    	tds: this.tdsCtrl,
    	type: this.typeCtrl,
    	device: this.deviceCtrl,
    	newDetailKey: this.newDetailKeyCtrl,
    	newDetailValue: this.newDetailValueCtrl
    });

    this.dataService.getPlantMaintenance(this.maintenance).subscribe(
      (data: ApiResult<PlantMaintenance>) => {
        this.maintenance = data.data;

		this.editForm.controls['type'].setValue(this.maintenance.maintenanceType);

		this.dataService.getActiveDevices().subscribe(data => {
    		this.devices = data;
    		this.editForm.controls['device'].setValue(this.maintenance.deviceId);
    	});

      },
      error => { // HttpErrorResponse
        if (error.status === 404) {
          this.componentCommunicationService.data.push(new AppNotification('Plant Maintenance not found', AppNotificationType.ERROR));
        } else {
          this.componentCommunicationService.data.push(new AppNotification('Unknown error', AppNotificationType.ERROR));
        }
        this.router.navigate(['maintenance']);
      }
    );
  }

  hasNotifications(): Boolean {
    return this.notifications.length > 0;
  }

  hasDetails(): Boolean {
    return this.maintenance !== undefined && this.maintenance.details !== undefined && this.maintenance.details.length > 0;
  }

}
