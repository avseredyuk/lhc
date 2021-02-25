import {AppNotification, AppNotificationType} from "../../model/app-notification";
import {Component, OnInit, ViewChild} from "@angular/core";
import {ComponentCommunicationService} from "../../service/component-communication.service";
import {DataService} from "../../service/data.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {SidebarComponent} from "../../sidebar/sidebar.component";
import {TokenCheckService} from "../../service/token-check.service";
import {UtilService} from "../../service/util.service";

@Component({
  selector: 'app-device-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class DeviceAddComponent implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  notifications: Array<AppNotification> = [];
  addForm: FormGroup;
  nameCtrl: FormControl = this.formBuilder.control('', [Validators.required, Validators.pattern(this.utilService.VALIDATION_PATTERN_DEVICE_NAME)]);
  tokenCtrl: FormControl = this.formBuilder.control('', [Validators.required, Validators.pattern(this.utilService.VALIDATION_PATTERN_DEVICE_TOKEN)]);

  constructor(private formBuilder: FormBuilder, private router: Router, private dataService: DataService,
    private tokenCheckService: TokenCheckService, private utilService: UtilService,
    private componentCommunicationService: ComponentCommunicationService) { }

  ngOnInit() {
  	if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
      return;
    }
    this.sidebar.setGoBackCallback(() => {this.router.navigate(['devices']);});

    this.addForm = this.formBuilder.group({
      name: this.nameCtrl,
      token: this.tokenCtrl,
    });
  }

 onSubmit() {
    this.dataService.createDevice(this.addForm.value)
      .subscribe( data => {
        this.componentCommunicationService.setNotification([new AppNotification('Success', AppNotificationType.SUCCESS)]);
        this.router.navigate(['devices']);
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
