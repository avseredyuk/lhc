import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../data.service";
import {PlantMaintenance} from "../model/plant-maintenance";
import {ApiResult} from "../model/api-result";
import {Device} from "../model/device";
import {ComponentCommunicationService} from "../component-communication.service";
import {AppNotification, AppNotificationType} from "../model/app-notification";
import {TokenCheckService} from "../token-check.service";
import {UtilService} from "../util.service";

@Component({
  selector: 'app-edit-plant-maintenance',
  templateUrl: './edit-plant-maintenance.component.html',
  styleUrls: ['./edit-plant-maintenance.component.scss']
})
export class EditPlantMaintenanceComponent {

  maintenanceId: number;
  maintenance: PlantMaintenance;
  notifications: Array<AppNotification> = [];
  editForm: FormGroup;
  phCtrl: FormControl;
  tdsCtrl: FormControl;
  typeCtrl: FormControl;
  newDetailKeyCtrl: FormControl;
  newDetailValueCtrl: FormControl;
  deviceId: number;

  constructor(private formBuilder: FormBuilder, private router: Router, private dataService: DataService, private route: ActivatedRoute,
  	private componentCommunicationService: ComponentCommunicationService, private tokenCheckService: TokenCheckService, private utilService: UtilService) {
  	this.route.params.subscribe(params => {
      this.maintenanceId = params.id;
      this.deviceId = params.deviceId;
    })
  }
//todo: update button not working when value is untouched but actually present, it's now working right now at all

  ngOnInit() {
  	if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
      return;
    }

    this.phCtrl = this.formBuilder.control('', [Validators.required]);
    this.tdsCtrl = this.formBuilder.control('', [Validators.required]);
    this.typeCtrl = this.formBuilder.control('', [Validators.required]);
    this.newDetailKeyCtrl = this.formBuilder.control('', []);
    this.newDetailValueCtrl = this.formBuilder.control('', []);

    this.editForm = this.formBuilder.group({
    	ph: this.phCtrl,
    	tds: this.tdsCtrl,
    	type: this.typeCtrl,
    	newDetailKey: this.newDetailKeyCtrl,
    	newDetailValue: this.newDetailValueCtrl
    });

    this.dataService.getPlantMaintenance(this.deviceId, this.maintenanceId).subscribe(
      (data: ApiResult<PlantMaintenance>) => {
        this.maintenance = data.data;
        this.editForm.controls['type'].setValue(this.maintenance.maintenanceType);
      },
      error => { // HttpErrorResponse
        if (error.status === 404) {
          this.componentCommunicationService.setValue("notification", new AppNotification('Plant Maintenance not found', AppNotificationType.ERROR));
        } else {
          this.componentCommunicationService.setValue("notification", new AppNotification('Unknown error', AppNotificationType.ERROR));
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
