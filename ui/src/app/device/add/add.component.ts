import {AppNotification, AppNotificationType} from "../../model/app-notification";
import {BaseAuthComponent} from "../../base-auth/base-auth.component";
import {Component, OnInit, ViewChild} from "@angular/core";
import {ComponentCommunicationService} from "../../service/component-communication.service";
import {DataService} from "../../service/data.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {SidebarComponent} from "../../parts/sidebar/sidebar.component";
import {TokenCheckService} from "../../service/token-check.service";
import {UtilService} from "../../service/util.service";

@Component({
  selector: 'app-device-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class DeviceAddComponent extends BaseAuthComponent implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  addForm: FormGroup;
  nameCtrl: FormControl = this.formBuilder.control('', [Validators.required, Validators.pattern(this.utilService.VALIDATION_PATTERN_DEVICE_NAME)]);
  tokenCtrl: FormControl = this.formBuilder.control('', [Validators.required, Validators.pattern(this.utilService.VALIDATION_PATTERN_DEVICE_TOKEN)]);

  constructor(private formBuilder: FormBuilder, public router: Router, private dataService: DataService,
    public tokenCheckService: TokenCheckService, private utilService: UtilService,
    public componentCommunicationService: ComponentCommunicationService) {
    super(router, componentCommunicationService, tokenCheckService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    
    this.sidebar.setGoBackCallback(() => {this.router.navigate(['devices']);});

    this.addForm = this.formBuilder.group({
      name: this.nameCtrl,
      token: this.tokenCtrl,
    });
  }

  onSubmit(): void {
    this.dataService.createDevice(this.addForm.value).subscribe(data => {
      this.navigateWithNotification('devices', [new AppNotification('Success', AppNotificationType.SUCCESS)]);
    }, error => {
      if (error.status === 400) {
        this.notificateThisPage(error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)}));
      } else {
        this.notificateThisPage([new AppNotification('Unknown error', AppNotificationType.ERROR)]);
      }
    });
  }

}
