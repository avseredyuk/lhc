import {BaseAuth} from "../../base/base-auth";
import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../service/data.service";
import {AppNotification, AppNotificationType} from "../../model/app-notification";
import {PlantMaintenance, PlantMaintenanceDetail} from "../../model/plant-maintenance";
import {TokenCheckService} from "../../service/token-check.service";
import {UtilService} from "../../service/util.service";
import {ComponentCommunicationService} from "../../service/component-communication.service";
import {SidebarComponent} from "../../parts/sidebar/sidebar.component";

@Component({
  selector: 'app-plant-maintenance-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class PlantMaintenanceAddComponent extends BaseAuth implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  addForm: FormGroup;
  phCtrl: FormControl = this.formBuilder.control('', [Validators.required, Validators.pattern(this.utilService.VALIDATION_PATTERN_PH)])
  tdsCtrl: FormControl = this.formBuilder.control('', [Validators.required, Validators.pattern(this.utilService.VALIDATION_PATTERN_TDS)]);
  typeCtrl: FormControl = this.formBuilder.control(this.utilService.dataTypes[1], [Validators.required]);
  newDetailKeyCtrl: FormControl = this.formBuilder.control('', []);
  newDetailValueCtrl: FormControl = this.formBuilder.control('', [])
  newDetails: Array<PlantMaintenanceDetail> = [];
  deviceId: number;

  constructor(private formBuilder: FormBuilder, public router: Router, private dataService: DataService,
    private route: ActivatedRoute, public tokenCheckService: TokenCheckService, public utilService: UtilService,
    public componentCommunicationService: ComponentCommunicationService) {
    super(router, componentCommunicationService, tokenCheckService);
    this.route.params.subscribe(params => this.deviceId = params.id)
  }

  ngOnInit(): void {
    super.ngOnInit();
    
    this.sidebar.setGoBackCallback(() => this.router.navigate(['devices', this.deviceId, 'maintenance']));

    this.addForm = this.formBuilder.group({
    	ph: this.phCtrl,
    	tds: this.tdsCtrl,
    	type: this.typeCtrl,
    	newDetailKey: this.newDetailKeyCtrl,
    	newDetailValue: this.newDetailValueCtrl
    });

    const clonedMaintenance = this.componentCommunicationService.getClonedMaintenance();
    if (clonedMaintenance !== undefined) {
      this.addForm.controls['ph'].setValue(clonedMaintenance.ph);
      this.addForm.controls['tds'].setValue(clonedMaintenance.tds);
      this.addForm.controls['type'].setValue(clonedMaintenance.maintenanceType);
      this.newDetails = clonedMaintenance.details;
      this.newDetails.forEach(detail => {
        detail.id = null;
      });
    }
  }

  addDetail(): void {
  	if (this.addForm.controls['newDetailKey'].value !== ''
      && this.addForm.controls['newDetailValue'].value !== ''
      && this.newDetails.filter(c => c.key === this.addForm.controls['newDetailKey'].value).length == 0) {
	  	this.newDetails.push(new PlantMaintenanceDetail(this.addForm.controls['newDetailKey'].value, this.addForm.controls['newDetailValue'].value));
  		this.addForm.controls['newDetailKey'].setValue('');
  		this.addForm.controls['newDetailValue'].setValue('');
  	}
  }

  removeDetail(detail: PlantMaintenanceDetail): void {
    this.newDetails = this.newDetails.filter(d => d.key != detail.key);
  }

  onSubmit(): void {
  	if (this.addForm.invalid) {
      return;
    }

    const newPm = new PlantMaintenance();
    newPm.deviceId = this.deviceId;
    newPm.maintenanceType = this.addForm.controls['type'].value;
    newPm.ph = parseFloat(this.addForm.controls['ph'].value);
    newPm.tds = parseFloat(this.addForm.controls['tds'].value);
    newPm.details = this.newDetails;

    this.dataService.createPlantMaintenance(newPm).subscribe(data => {
      this.navigateWithNotification(['devices', this.deviceId, 'maintenance'], [new AppNotification('Success', AppNotificationType.SUCCESS)]);
    }, error => {
      if (error.status === 400) {
        this.notificateThisPage(error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)}));
      } else {
        this.notificateThisPage([new AppNotification('Unknown error', AppNotificationType.ERROR)]);
      }
    });
  }

  hasDetails(): boolean {
    return this.newDetails.length > 0;
  }
}
