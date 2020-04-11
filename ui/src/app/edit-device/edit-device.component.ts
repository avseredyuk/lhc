import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ComponentCommunicationService} from "../component-communication.service";
import {DataService} from "../data.service";
import {AppNotification, AppNotificationType} from "../model/app-notification";
import {TokenCheckService} from "../token-check.service";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {ApiResult} from "../model/api-result";
import {Device, DeviceConfig, DeviceReportDataExclusion} from "../model/device";
import {UtilService} from "../util.service";

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss']
})
export class EditDeviceComponent implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  notifications: Array<AppNotification> = [];
  deviceId: number;
  device: Device = new Device();
  editForm: FormGroup;
  deviceNameCtrl: FormControl = this.formBuilder.control('', [Validators.required]);
  deviceTokenCtrl: FormControl = this.formBuilder.control('', [Validators.required]);
  deviceEnabledCtrl: FormControl = this.formBuilder.control('', [Validators.required]);
  newConfigKeyCtrl: FormControl = this.formBuilder.control(this.utilService.deviceConfigKeys[0], []);
  newConfigValueCtrl: FormControl = this.formBuilder.control('', []);
  newConfigTypeCtrl: FormControl = this.formBuilder.control(this.utilService.deviceConfigDataTypes[0], []);
  newExclusionTypeCtrl: FormControl = this.formBuilder.control(this.utilService.deviceReportDataExclusionTypes[0], []);

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private dataService: DataService,
  	private tokenCheckService: TokenCheckService, private componentCommunicationService: ComponentCommunicationService,
  	public utilService: UtilService) {
  	this.route.params.subscribe(params => this.deviceId = params.id)
  }

  ngOnInit() {
  	if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
      return;
    }
    this.sidebar.setGoBackCallback(() => {this.router.navigate(['devices/' + this.deviceId]);});

    this.editForm = this.formBuilder.group({
    	deviceName: this.deviceNameCtrl,
    	deviceToken: this.deviceTokenCtrl,
    	deviceEnabled: this.deviceEnabledCtrl,
    	newConfigKey: this.newConfigKeyCtrl,
    	newConfigValue: this.newConfigValueCtrl,
    	newConfigType: this.newConfigTypeCtrl,
    	newExclusionType: this.newExclusionTypeCtrl
    });

    this.loadDevice();
  }

  loadDevice() {
    this.dataService.getDevice(this.deviceId).subscribe(
      (data: ApiResult<Device>) => {
        this.device = data.data;
        this.editForm.controls['deviceName'].setValue(this.device.name);
        this.editForm.controls['deviceToken'].setValue(this.device.token);
        this.editForm.controls['deviceEnabled'].setValue(this.device.enabled);
      },
      error => {
        if (error.status === 404) {
          this.componentCommunicationService.setNotification([new AppNotification('Device not found', AppNotificationType.ERROR)]);
        } else {
          this.componentCommunicationService.setNotification([new AppNotification('Unknown error', AppNotificationType.ERROR)]);
        }
        this.router.navigate(['devices/' + this.deviceId]);
      }
    );
  }

  addConfig() {
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

  removeConfig(config: DeviceConfig) {
    this.device.config = this.device.config.filter(c => c.key != config.key);
  }

  addExclusion() {
  	if (this.editForm.controls['newExclusionType'].value !== ''
  		&& this.device.exclusions.filter(e => e.map === this.editForm.controls['newExclusionType'].value).length == 0) {
      this.device.exclusions.push(
      	new DeviceReportDataExclusion(this.editForm.controls['newExclusionType'].value)
      );
      this.editForm.controls['newExclusionType'].setValue(this.utilService.deviceReportDataExclusionTypes[0]);
    }
  }

  removeExclusion(exclusion: DeviceReportDataExclusion) {
    this.device.exclusions = this.device.exclusions.filter(e => e.map != exclusion.map);
  }

  updateDevice() {
    this.device.name = this.editForm.controls['deviceName'].value;
    this.device.token = this.editForm.controls['deviceToken'].value;
    this.device.enabled = this.editForm.controls['deviceEnabled'].value;
    this.dataService.updateDevice(this.device)
      .subscribe( data => {
        this.router.navigate(['devices/' + this.deviceId]);
      });
  }

  hasNotifications(): Boolean {
    return this.notifications.length > 0;
  }

  hasConfig(): Boolean {
    return this.device.config && this.device.config.length > 0;
  }

  hasExclusions(): Boolean {
    return this.device.exclusions && this.device.exclusions.length > 0;
  }

}
