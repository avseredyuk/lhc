import {BaseAuthComponent} from "../../base-auth/base-auth.component";
import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../../service/data.service";
import {AppNotification, AppNotificationType} from "../../model/app-notification";
import {Configuration} from "../../model/configuration";
import {ComponentCommunicationService} from "../../service/component-communication.service";
import {SidebarComponent} from "../../parts/sidebar/sidebar.component";
import {UtilService} from "../../service/util.service";
import {TokenCheckService} from "../../service/token-check.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-settings-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class SettingsAddComponent extends BaseAuthComponent implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  addForm: FormGroup;
  keyCtrl: FormControl = this.formBuilder.control('', [Validators.required]);
  valueCtrl: FormControl = this.formBuilder.control('', [Validators.required]);

  constructor(private formBuilder: FormBuilder, public router: Router, private dataService: DataService,
    public tokenCheckService: TokenCheckService, public utilService: UtilService,
    public componentCommunicationService: ComponentCommunicationService) {
    super(router, componentCommunicationService, tokenCheckService);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.sidebar.setGoBackCallback(() => {
      this.router.navigate(['settings']);
    });

    this.addForm = this.formBuilder.group({
    	key: this.keyCtrl,
    	value: this.valueCtrl
    });
  }

  onSubmit(): void {
  	if (this.addForm.invalid) {
      return;
    }

    const newConf = new Configuration();
    newConf.key = this.addForm.controls['key'].value;
    newConf.value = this.addForm.controls['value'].value;

    this.dataService.createConfiguration(newConf).subscribe(data => {
      this.navigateWithNotification('settings', [new AppNotification('Success', AppNotificationType.SUCCESS)]);
    }, error => {
      if (error.status === 400) {
        this.notificateThisPage(error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)}));
      } else {
        this.notificateThisPage([new AppNotification('Unknown error', AppNotificationType.ERROR)]);
      }
    });
  }

}
