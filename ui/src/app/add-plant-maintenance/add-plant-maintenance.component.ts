import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../data.service";
import {AppNotification} from "../model/app-notification";
import {Device} from "../model/device";
import {PlantMaintenance, PlantMaintenanceDetail} from "../model/plant-maintenance";
import {TokenCheckService} from "../token-check.service";
import {UtilService} from "../util.service";
import {ComponentCommunicationService} from "../component-communication.service";
import {SidebarComponent} from "../sidebar/sidebar.component";

@Component({
  selector: 'app-add-plant-maintenance',
  templateUrl: './add-plant-maintenance.component.html',
  styleUrls: ['./add-plant-maintenance.component.scss']
})
export class AddPlantMaintenanceComponent {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  notifications: Array<AppNotification> = [];
  addForm: FormGroup;
  phCtrl: FormControl = this.formBuilder.control('', [Validators.required, Validators.pattern(this.utilService.VALIDATION_PATTERN_PH)])
  tdsCtrl: FormControl = this.formBuilder.control('', [Validators.required, Validators.pattern(this.utilService.VALIDATION_PATTERN_TDS)]);
  typeCtrl: FormControl = this.formBuilder.control(this.utilService.dataTypes[1], [Validators.required]);
  newDetailKeyCtrl: FormControl = this.formBuilder.control('', []);
  newDetailValueCtrl: FormControl = this.formBuilder.control('', [])
  newDetails: Array<PlantMaintenanceDetail> = [];
  deviceId: number;
  deviceName: string;
  pageNumber: number;

  constructor(private formBuilder: FormBuilder, private router: Router, private dataService: DataService,
    private route: ActivatedRoute, private tokenCheckService: TokenCheckService, public utilService: UtilService,
    private componentCommunicationService: ComponentCommunicationService) {
  	this.route.params.subscribe(params => this.deviceId = params.id)
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

    this.addForm = this.formBuilder.group({
    	ph: this.phCtrl,
    	tds: this.tdsCtrl,
    	type: this.typeCtrl,
    	newDetailKey: this.newDetailKeyCtrl,
    	newDetailValue: this.newDetailValueCtrl
    });

    let clonedMaintenance = this.componentCommunicationService.getClonedMaintenance();
    if (clonedMaintenance !== undefined) {
      this.addForm.controls['ph'].setValue(clonedMaintenance.ph);
      this.addForm.controls['tds'].setValue(clonedMaintenance.tds);
      this.addForm.controls['type'].setValue(clonedMaintenance.maintenanceType);
      this.newDetails = clonedMaintenance.details;
      this.newDetails.forEach((detail, index, a) => {
        detail.id = null;
      });
    }

    this.dataService.getDevice(this.deviceId).subscribe(
      apiResult => this.deviceName = apiResult.data.name
    );
  }

  addDetail() {
  	if (this.addForm.controls['newDetailKey'].value !== ''
      && this.addForm.controls['newDetailValue'].value !== ''
      && this.newDetails.filter(c => c.key === this.addForm.controls['newDetailKey'].value).length == 0) {
	  	this.newDetails.push(new PlantMaintenanceDetail(this.addForm.controls['newDetailKey'].value, this.addForm.controls['newDetailValue'].value));
  		this.addForm.controls['newDetailKey'].setValue('');
  		this.addForm.controls['newDetailValue'].setValue('');
  	}
  }

  removeDetail(detail: PlantMaintenanceDetail) {
    this.newDetails = this.newDetails.filter(d => d.key != detail.key);
  }

  onSubmit() {
  	if (this.addForm.invalid) {
      return;
    }

    let newPm = new PlantMaintenance();
    newPm.deviceId = this.deviceId;
    newPm.maintenanceType = this.addForm.controls['type'].value;
    newPm.ph = parseFloat(this.addForm.controls['ph'].value);
    newPm.tds = parseFloat(this.addForm.controls['tds'].value);
    newPm.details = this.newDetails;

    this.dataService.createPlantMaintenance(newPm)
      .subscribe( data => {
        this.router.navigate(['devices/' + this.deviceId + '/maintenance']);
      });
  }

  hasNotifications(): Boolean {
    return this.notifications.length > 0;
  }

  hasDetails(): Boolean {
    return this.newDetails.length > 0;
  }
}
