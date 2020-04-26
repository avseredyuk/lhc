import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../data.service";
import {PlantMaintenance, PlantMaintenanceDetail} from "../model/plant-maintenance";
import {ApiResult} from "../model/api-result";
import {Device} from "../model/device";
import {ComponentCommunicationService} from "../component-communication.service";
import {AppNotification, AppNotificationType} from "../model/app-notification";
import {TokenCheckService} from "../token-check.service";
import {UtilService} from "../util.service";
import {SidebarComponent} from "../sidebar/sidebar.component";

@Component({
  selector: 'app-edit-plant-maintenance',
  templateUrl: './edit-plant-maintenance.component.html',
  styleUrls: ['./edit-plant-maintenance.component.scss']
})
export class EditPlantMaintenanceComponent {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  maintenanceId: number;
  maintenance: PlantMaintenance;
  notifications: Array<AppNotification> = [];
  editForm: FormGroup;
  phCtrl: FormControl = this.formBuilder.control('', [Validators.required, Validators.pattern(this.utilService.VALIDATION_PATTERN_PH)]);
  tdsCtrl: FormControl = this.formBuilder.control('', [Validators.required, Validators.pattern(this.utilService.VALIDATION_PATTERN_TDS)]);
  typeCtrl: FormControl = this.formBuilder.control('', [Validators.required]);
  newDetailKeyCtrl: FormControl = this.formBuilder.control('', []);
  newDetailValueCtrl: FormControl = this.formBuilder.control('', []);
  deviceId: number;
  deviceName: string;
  pageNumber: number;

  constructor(private formBuilder: FormBuilder, private router: Router, private dataService: DataService, private route: ActivatedRoute,
  	private componentCommunicationService: ComponentCommunicationService, private tokenCheckService: TokenCheckService, private utilService: UtilService) {
  	this.route.params.subscribe(params => {
      this.maintenanceId = params.id;
      this.deviceId = params.deviceId;
    })
  }

  ngOnInit() {
  	if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
      return;
    }

    this.sidebar.setGoBackCallback(() => {
      this.componentCommunicationService.setPageNumber(this.pageNumber);
      this.router.navigate(['devices/' + this.deviceId + '/maintenance']);
    });
    this.pageNumber = this.componentCommunicationService.getPageNumber();

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
        this.editForm.controls['ph'].setValue(this.maintenance.ph)
        this.editForm.controls['tds'].setValue(this.maintenance.tds);
      },
      error => {
        if (error.status === 400) {
          this.notifications = error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)});
        } else {
          this.componentCommunicationService.setNotification([new AppNotification('Unknown error', AppNotificationType.ERROR)]);
        }
        this.router.navigate(['maintenance']);
      }
    );
    this.dataService.getDevice(this.deviceId).subscribe(
      apiResult => this.deviceName = apiResult.data.name
    );
  }

  addDetail() {
    if (this.editForm.controls['newDetailKey'].value !== ''
      && this.editForm.controls['newDetailValue'].value !== ''
      && this.maintenance.details.filter(c => c.key === this.editForm.controls['newDetailKey'].value).length == 0) {
      this.maintenance.details.push(new PlantMaintenanceDetail(this.editForm.controls['newDetailKey'].value, this.editForm.controls['newDetailValue'].value));
      this.editForm.controls['newDetailKey'].setValue('');
      this.editForm.controls['newDetailValue'].setValue('');
    }
  }

  onSubmit() {
    if (this.editForm.invalid) {
      return;
    }
    this.maintenance.maintenanceType = this.editForm.controls['type'].value;
    this.maintenance.ph = parseFloat(this.editForm.controls['ph'].value);
    this.maintenance.tds = parseFloat(this.editForm.controls['tds'].value);
    this.dataService.updatePlantMaintenance(this.maintenance)
      .subscribe( data => {
        this.router.navigate(['devices/' + this.deviceId + '/maintenance']);
      });
  }

  removeDetail(detail: PlantMaintenanceDetail) {
    this.maintenance.details = this.maintenance.details.filter(d => d.key != detail.key);
  }

  hasNotifications(): Boolean {
    return this.notifications.length > 0;
  }

  hasDetails(): Boolean {
    return this.maintenance !== undefined && this.maintenance.details !== undefined && this.maintenance.details.length > 0;
  }

}
