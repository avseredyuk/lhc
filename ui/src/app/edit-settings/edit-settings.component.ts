import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ComponentCommunicationService} from "../component-communication.service";
import {AppNotification, AppNotificationType} from "../model/app-notification";
import {Configuration} from "../model/configuration";
import {TokenCheckService} from "../token-check.service";
import {UtilService} from "../util.service";
import {DataService} from "../data.service";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {ApiResult} from "../model/api-result";

@Component({
  selector: 'app-edit-settings',
  templateUrl: './edit-settings.component.html',
  styleUrls: ['./edit-settings.component.scss']
})
export class EditSettingsComponent implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  notifications: Array<AppNotification> = [];
  settingsKey: string;
  editForm: FormGroup;
  keyCtrl: FormControl;
  valueCtrl: FormControl;
  configuration: Configuration;

  constructor(private formBuilder: FormBuilder, private router: Router, private dataService: DataService, private route: ActivatedRoute,
  	private componentCommunicationService: ComponentCommunicationService, private tokenCheckService: TokenCheckService, private utilService: UtilService) {
  	this.route.params.subscribe(params => {
      this.settingsKey = params.key;
    })
  }

  ngOnInit() {
  	if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
      return;
    }

    this.sidebar.setGoBackCallback(() => {
      this.router.navigate(['settings']);
    });

    this.keyCtrl = this.formBuilder.control('', [Validators.required]);
    this.valueCtrl = this.formBuilder.control('', [Validators.required]);
    this.editForm = this.formBuilder.group({
    	key: this.keyCtrl,
    	value: this.valueCtrl
    });

    this.dataService.getConfigurationByKey(this.settingsKey).subscribe(
      (data: ApiResult<Configuration>) => {
        this.configuration = data.data;
        this.editForm.controls['key'].setValue(this.configuration.key);
        this.editForm.controls['value'].setValue(this.configuration.value);
      },
      error => {
        if (error.status === 404) {
          this.componentCommunicationService.setNotification([new AppNotification('Plant Maintenance not found', AppNotificationType.ERROR)]);
        } else {
          this.componentCommunicationService.setNotification([new AppNotification('Unknown error', AppNotificationType.ERROR)]);
        }
        this.router.navigate(['settings']);
      }
    );
  }

  onSubmit() {
    this.configuration.key = this.editForm.controls['key'].value;
    this.configuration.value = this.editForm.controls['value'].value;
    this.dataService.updateConfiguration(this.configuration).subscribe(
      data => {
      	this.componentCommunicationService.setNotification([new AppNotification('Success', AppNotificationType.SUCCESS)]);
        this.router.navigate(['settings']);
      },
      error => {
        if (error.status === 400) {
          this.notifications = error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)});
        } else {
          this.notifications = [new AppNotification('Unknown error', AppNotificationType.ERROR)];
        }
      });
  }

  hasNotifications(): Boolean {
    return this.notifications.length > 0;
  }
}
