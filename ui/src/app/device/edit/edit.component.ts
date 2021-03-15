import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {BaseAuth} from "../../base/base-auth";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ComponentCommunicationService} from "../../service/component-communication.service";
import {DataService} from "../../service/data.service";
import {AppNotification, AppNotificationType} from "../../model/app-notification";
import {TokenCheckService} from "../../service/token-check.service";
import {SidebarComponent} from "../../parts/sidebar/sidebar.component";
import {ApiResult} from "../../model/api-result";
import {Device, DeviceConfig, DeviceReportDataExclusion} from "../../model/device";
import {UtilService} from "../../service/util.service";

@Component({
  selector: 'app-device-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class DeviceEditComponent extends BaseAuth implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  deviceId: number;
  device: Device = new Device();
  editForm: FormGroup;
  originalDeviceName: string;
  deviceNameCtrl: FormControl = this.formBuilder.control('', [Validators.required]);
  deviceTokenCtrl: FormControl = this.formBuilder.control('', [Validators.required]);
  deviceEnabledCtrl: FormControl = this.formBuilder.control('', [Validators.required]);
  deviceNotesCtrl: FormControl = this.formBuilder.control('', []);
  devicePrivateNameCtrl: FormControl = this.formBuilder.control('', []);
  newConfigKeyCtrl: FormControl = this.formBuilder.control(this.utilService.deviceConfigKeys[0], []);
  newConfigValueCtrl: FormControl = this.formBuilder.control('', []);
  newConfigTypeCtrl: FormControl = this.formBuilder.control(this.utilService.deviceConfigDataTypes[0], []);
  newExclusionTypeCtrl: FormControl = this.formBuilder.control(this.utilService.deviceReportDataExclusionTypes[0], []);

  constructor(private formBuilder: FormBuilder, public router: Router, private route: ActivatedRoute, private dataService: DataService,
  	public tokenCheckService: TokenCheckService, public componentCommunicationService: ComponentCommunicationService,
  	public utilService: UtilService) {
    super(router, componentCommunicationService, tokenCheckService);
  	this.route.params.subscribe(params => this.deviceId = params.id)
  }

  ngOnInit(): void {
    super.ngOnInit();
    
    this.sidebar.setGoBackCallback(() => this.router.navigate(['devices', this.deviceId]));

    this.editForm = this.formBuilder.group({
    	deviceName: this.deviceNameCtrl,
    	deviceToken: this.deviceTokenCtrl,
    	deviceEnabled: this.deviceEnabledCtrl,
      deviceNotes: this.deviceNotesCtrl,
      devicePrivateName: this.devicePrivateNameCtrl,
    	newConfigKey: this.newConfigKeyCtrl,
    	newConfigValue: this.newConfigValueCtrl,
    	newConfigType: this.newConfigTypeCtrl,
    	newExclusionType: this.newExclusionTypeCtrl
    });

    this.loadDevice();
  }

  loadDevice(): void {
    this.dataService.getDevice(this.deviceId).subscribe(
      (data: ApiResult<Device>) => {
        this.device = data.data;
        this.originalDeviceName = data.data.name;
        this.editForm.controls['deviceName'].setValue(this.device.name);
        this.editForm.controls['deviceToken'].setValue(this.device.token);
        this.editForm.controls['deviceEnabled'].setValue(this.device.enabled);
        this.editForm.controls['deviceNotes'].setValue(this.device.notes);
        this.editForm.controls['devicePrivateName'].setValue(this.device.privateName);
      },
      error => {
        let errNotification;
        if (error.status === 404) {
          errNotification = [new AppNotification('Device not found', AppNotificationType.ERROR)];
        } else {
          errNotification = [new AppNotification('Unknown error', AppNotificationType.ERROR)];
        }
        this.navigateWithNotification(['devices', this.deviceId], errNotification);
      }
    );
  }

  addConfig(): void {
    if (this.editForm.controls['newConfigKey'].value !== ''
    	&& this.editForm.controls['newConfigValue'].value !== ''
    	&& this.editForm.controls['newConfigType'].value !== ''
    	&& this.device.config.filter(c => c.key === this.editForm.controls['newConfigKey'].value).length == 0) {
      this.device.config.push(
      	new DeviceConfig(this.editForm.controls['newConfigKey'].value,
      	 this.editForm.controls['newConfigValue'].value,
      	 this.editForm.controls['newConfigType'].value)
      );
      this.editForm.controls['newConfigKey'].setValue(this.utilService.deviceConfigKeys[0]);
      this.editForm.controls['newConfigValue'].setValue('');
      this.editForm.controls['newConfigType'].setValue(this.utilService.deviceConfigDataTypes[0]);
    }
  }

  removeConfig(config: DeviceConfig): void {
    this.device.config = this.device.config.filter(c => c.key != config.key);
  }

  addExclusion(): void {
  	if (this.editForm.controls['newExclusionType'].value !== ''
  		&& this.device.exclusions.filter(e => e.map === this.editForm.controls['newExclusionType'].value).length == 0) {
      this.device.exclusions.push(
      	new DeviceReportDataExclusion(this.editForm.controls['newExclusionType'].value)
      );
      this.editForm.controls['newExclusionType'].setValue(this.utilService.deviceReportDataExclusionTypes[0]);
    }
  }

  removeExclusion(exclusion: DeviceReportDataExclusion): void {
    this.device.exclusions = this.device.exclusions.filter(e => e.map != exclusion.map);
  }

  updateDevice(): void {
    this.device.name = this.editForm.controls['deviceName'].value;
    this.device.token = this.editForm.controls['deviceToken'].value;
    this.device.enabled = this.editForm.controls['deviceEnabled'].value;
    this.device.notes = this.editForm.controls['deviceNotes'].value;
    this.device.privateName = this.editForm.controls['devicePrivateName'].value;
    this.dataService.updateDevice(this.device).subscribe(data => {
      this.navigateWithNotification(['devices', this.deviceId], [new AppNotification('Success', AppNotificationType.SUCCESS)]);
    }, error => {
      if (error.status === 400) {
        this.notificateThisPage(error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)}));
      } else {
        this.notificateThisPage([new AppNotification('Unknown error', AppNotificationType.ERROR)]);
      }
    });
  }

  hasConfig(): boolean {
    return this.device.config && this.device.config.length > 0;
  }

  hasExclusions(): boolean {
    return this.device.exclusions && this.device.exclusions.length > 0;
  }

}
