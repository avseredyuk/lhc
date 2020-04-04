import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../data.service";
import {AppNotification, AppNotificationType} from "../model/app-notification";
import {Configuration} from "../model/configuration";
import {ComponentCommunicationService} from "../component-communication.service";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {UtilService} from "../util.service";
import {TokenCheckService} from "../token-check.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-settings',
  templateUrl: './add-settings.component.html',
  styleUrls: ['./add-settings.component.scss']
})
export class AddSettingsComponent implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  notifications: Array<AppNotification> = [];
  addForm: FormGroup;
  keyCtrl: FormControl;
  valueCtrl: FormControl;

  constructor(private formBuilder: FormBuilder, private router: Router, private dataService: DataService,
    private tokenCheckService: TokenCheckService, public utilService: UtilService,
    private componentCommunicationService: ComponentCommunicationService) { }

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
      
    this.addForm = this.formBuilder.group({
    	key: this.keyCtrl,
    	value: this.valueCtrl
    });
  }

  onSubmit() {
  	if (this.addForm.invalid) {
      return;
    }

    let newConf = new Configuration();
    newConf.key = this.addForm.controls['key'].value;
    newConf.value = this.addForm.controls['value'].value;

    this.dataService.createConfiguration(newConf)
      .subscribe( data => {
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
