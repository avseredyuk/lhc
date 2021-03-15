import {BaseAuth} from "../../base/base-auth";
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ComponentCommunicationService} from "../../service/component-communication.service";
import {AppNotification, AppNotificationType} from "../../model/app-notification";
import {Configuration} from "../../model/configuration";
import {TokenCheckService} from "../../service/token-check.service";
import {UtilService} from "../../service/util.service";
import {DataService} from "../../service/data.service";
import {SidebarComponent} from "../../parts/sidebar/sidebar.component";
import {ApiResult} from "../../model/api-result";

@Component({
  selector: 'app-settings-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class SettingsEditComponent extends BaseAuth implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  settingsKey: string;
  editForm: FormGroup;
  keyCtrl: FormControl = this.formBuilder.control('', [Validators.required]);
  valueCtrl: FormControl = this.formBuilder.control('', [Validators.required]);
  configuration: Configuration;

  constructor(private formBuilder: FormBuilder, public router: Router, private dataService: DataService, private route: ActivatedRoute,
  	public componentCommunicationService: ComponentCommunicationService, public tokenCheckService: TokenCheckService, private utilService: UtilService) {
  	super(router, componentCommunicationService, tokenCheckService);
    this.route.params.subscribe(params => {
      this.settingsKey = params.key;
    })
  }

  ngOnInit(): void {
    super.ngOnInit();
    
    this.sidebar.setGoBackCallback(() => this.router.navigate(['settings']));

    this.editForm = this.formBuilder.group({
    	key: this.keyCtrl,
    	value: this.valueCtrl
    });

    this.dataService.getConfigurationByKey(this.settingsKey).subscribe((data: ApiResult<Configuration>) => {
      this.configuration = data.data;
      this.editForm.controls['key'].setValue(this.configuration.key);
      this.editForm.controls['value'].setValue(this.configuration.value);
    }, error => {
      let errNotification;
      if (error.status === 404) {
        errNotification = [new AppNotification('Settings not found', AppNotificationType.ERROR)];
      } else {
        errNotification = [new AppNotification('Unknown error', AppNotificationType.ERROR)];
      }
      this.navigateWithNotification(['settings'], errNotification);
    });
  }

  onSubmit(): void {
    this.configuration.key = this.editForm.controls['key'].value;
    this.configuration.value = this.editForm.controls['value'].value;
    this.dataService.updateConfiguration(this.configuration).subscribe(data => {
      this.navigateWithNotification(['settings'], [new AppNotification('Success', AppNotificationType.SUCCESS)]);
    }, error => {
      if (error.status === 400) {
        this.notificateThisPage(error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)}));
      } else {
        this.notificateThisPage([new AppNotification('Unknown error', AppNotificationType.ERROR)]);
      }
    });
  }
}
