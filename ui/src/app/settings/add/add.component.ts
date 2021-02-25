import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../../service/data.service";
import {AppNotification, AppNotificationType} from "../../model/app-notification";
import {Configuration} from "../../model/configuration";
import {ComponentCommunicationService} from "../../service/component-communication.service";
import {SidebarComponent} from "../../sidebar/sidebar.component";
import {UtilService} from "../../service/util.service";
import {TokenCheckService} from "../../service/token-check.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-settings-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class SettingsAddComponent implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  notifications: Array<AppNotification> = [];
  addForm: FormGroup;
  keyCtrl: FormControl = this.formBuilder.control('', [Validators.required]);
  valueCtrl: FormControl = this.formBuilder.control('', [Validators.required]);

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
