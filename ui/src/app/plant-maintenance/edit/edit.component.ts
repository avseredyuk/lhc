import {BaseAuth} from "../../base/base-auth";
import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../service/data.service";
import {PlantMaintenance, PlantMaintenanceDetail} from "../../model/plant-maintenance";
import {ApiResult} from "../../model/api-result";
import {ComponentCommunicationService} from "../../service/component-communication.service";
import {AppNotification, AppNotificationType} from "../../model/app-notification";
import {TokenCheckService} from "../../service/token-check.service";
import {UtilService} from "../../service/util.service";
import {SidebarComponent} from "../../parts/sidebar/sidebar.component";

@Component({
  selector: 'app-plant-maintenance-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class PlantMaintenanceEditComponent extends BaseAuth implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  maintenanceId: number;
  maintenance: PlantMaintenance;
  editForm: FormGroup;
  phCtrl: FormControl = this.formBuilder.control('', [Validators.required, Validators.pattern(this.utilService.VALIDATION_PATTERN_PH)]);
  tdsCtrl: FormControl = this.formBuilder.control('', [Validators.required, Validators.pattern(this.utilService.VALIDATION_PATTERN_TDS)]);
  typeCtrl: FormControl = this.formBuilder.control('', [Validators.required]);
  dateCtrl: FormControl = this.formBuilder.control('', [Validators.required]);
  timeCtrl: FormControl = this.formBuilder.control('', [Validators.required]);
  newDetailKeyCtrl: FormControl = this.formBuilder.control('', []);
  newDetailValueCtrl: FormControl = this.formBuilder.control('', []);
  deviceId: number;
  newDate: Date;
  newTime: Date;

  constructor(private formBuilder: FormBuilder, public router: Router, private dataService: DataService, private route: ActivatedRoute,
  	public componentCommunicationService: ComponentCommunicationService, public tokenCheckService: TokenCheckService, private utilService: UtilService) {
  	super(router, componentCommunicationService, tokenCheckService);
    this.route.params.subscribe(params => {
      this.deviceId = params.id;
      this.maintenanceId = params.maintenanceid;
    })
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.sidebar.setGoBackCallback(() => this.router.navigate(['devices', this.deviceId, 'maintenance']));

    this.editForm = this.formBuilder.group({
    	ph: this.phCtrl,
    	tds: this.tdsCtrl,
    	type: this.typeCtrl,
      date: this.dateCtrl,
      time: this.timeCtrl,
    	newDetailKey: this.newDetailKeyCtrl,
    	newDetailValue: this.newDetailValueCtrl
    });

    this.dataService.getPlantMaintenance(this.deviceId, this.maintenanceId).subscribe(
      (data: ApiResult<PlantMaintenance>) => {
        this.maintenance = data.data;
        this.editForm.controls['type'].setValue(this.maintenance.maintenanceType);
        this.editForm.controls['ph'].setValue(this.maintenance.ph)
        this.editForm.controls['tds'].setValue(this.maintenance.tds);
        this.editForm.controls['date'].setValue(this.utilService.getDateFromDateTime(this.maintenance.d));
        this.editForm.controls['time'].setValue(this.utilService.getTimeFromDateTime(this.maintenance.d));
        this.newDate = new Date(this.maintenance.d);
        this.newTime = new Date(this.maintenance.d);
      },
      error => {
        let errNotification;
        if (error.status === 400) {
          errNotification = error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)});
        } else {
          errNotification = [new AppNotification('Unknown error', AppNotificationType.ERROR)];
        }
        this.navigateWithNotification(['maintenance'], errNotification);
      }
    );
  }

  addDetail(): void {
    if (this.editForm.controls['newDetailKey'].value !== ''
      && this.editForm.controls['newDetailValue'].value !== ''
      && this.maintenance.details.filter(c => c.key === this.editForm.controls['newDetailKey'].value).length == 0) {
      this.maintenance.details.push(new PlantMaintenanceDetail(this.editForm.controls['newDetailKey'].value, this.editForm.controls['newDetailValue'].value));
      this.editForm.controls['newDetailKey'].setValue('');
      this.editForm.controls['newDetailValue'].setValue('');
    }
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      return;
    }
    this.maintenance.maintenanceType = this.editForm.controls['type'].value;
    this.maintenance.ph = parseFloat(this.editForm.controls['ph'].value);
    this.maintenance.tds = parseFloat(this.editForm.controls['tds'].value);
    this.maintenance.d = this.utilService.combineDateAndTime(this.newDate, this.newTime).getTime();
    this.dataService.updatePlantMaintenance(this.maintenance).subscribe(data => {
      this.navigateWithNotification(['devices', this.deviceId, 'maintenance'], [new AppNotification('Success', AppNotificationType.SUCCESS)]);
    });
  }

  removeDetail(detail: PlantMaintenanceDetail): void {
    this.maintenance.details = this.maintenance.details.filter(d => d.key != detail.key);
  }

  hasDetails(): boolean {
    return this.maintenance !== undefined && this.maintenance.details !== undefined && this.maintenance.details.length > 0;
  }

}
