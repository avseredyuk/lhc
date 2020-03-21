import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../data.service";
import {AppNotification} from "../model/app-notification";
import {Device} from "../model/device";
import {PlantMaintenance, PlantMaintenanceDetail} from "../model/plant-maintenance";
import {TokenCheckService} from "../token-check.service";
import {UtilService} from "../util.service";
import {ComponentCommunicationService} from "../component-communication.service";

@Component({
  selector: 'app-add-plant-maintenance',
  templateUrl: './add-plant-maintenance.component.html',
  styleUrls: ['./add-plant-maintenance.component.scss']
})
export class AddPlantMaintenanceComponent {

  notifications: Array<AppNotification> = [];
  addForm: FormGroup;
  phCtrl: FormControl;
  tdsCtrl: FormControl;
  typeCtrl: FormControl;
  newDetailKeyCtrl: FormControl;
  newDetailValueCtrl: FormControl;
  newDetails: Array<PlantMaintenanceDetail> = [];
  deviceId: number;
  deviceName: string;

  constructor(private formBuilder: FormBuilder, private router: Router, private dataService: DataService,
    private route: ActivatedRoute, private tokenCheckService: TokenCheckService, private utilService: UtilService,
    private componentCommunicationService: ComponentCommunicationService) {
  	this.route.params.subscribe(params => this.deviceId = params.id)
  }

  ngOnInit() {
  	if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
      return;
    }

    let clonedMaintenance = this.componentCommunicationService.getValue("clonedMaintenance");
    if (clonedMaintenance !== undefined) {
      this.phCtrl = this.formBuilder.control(clonedMaintenance.ph, [Validators.required]);
      this.tdsCtrl = this.formBuilder.control(clonedMaintenance.tds, [Validators.required]);
      this.typeCtrl = this.formBuilder.control(clonedMaintenance.maintenanceType, [Validators.required]);
      this.newDetails = clonedMaintenance.details;
      this.newDetails.forEach((detail, index, a) => {
        detail.id = null;
      });
    } else {
      this.phCtrl = this.formBuilder.control('', [Validators.required]);
      this.tdsCtrl = this.formBuilder.control('', [Validators.required]);
      this.typeCtrl = this.formBuilder.control(this.utilService.dataTypes[1], [Validators.required]);
    }
    this.newDetailKeyCtrl = this.formBuilder.control('', []);
    this.newDetailValueCtrl = this.formBuilder.control('', []);

    this.addForm = this.formBuilder.group({
    	ph: this.phCtrl,
    	tds: this.tdsCtrl,
    	type: this.typeCtrl,
    	newDetailKey: this.newDetailKeyCtrl,
    	newDetailValue: this.newDetailValueCtrl
    });

    this.dataService.getDevice(this.deviceId).subscribe(
      apiResult => this.deviceName = apiResult.data.name
    );
  }

  addDetail() {
  	if (this.addForm.controls['newDetailKey'].value !== '' && this.addForm.controls['newDetailValue'].value !== '') {
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
    newPm.ph = parseFloat(this.addForm.controls['ph'].value);//todo: it parses string into null, it should validate it or at BE
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
