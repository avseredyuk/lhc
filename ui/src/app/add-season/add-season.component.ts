import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../data.service";
import {AppNotification, AppNotificationType} from "../model/app-notification";
import {Device} from "../model/device";
import {Season} from "../model/season";
import {TokenCheckService} from "../token-check.service";
import {UtilService} from "../util.service";
import {ComponentCommunicationService} from "../component-communication.service";
import {SidebarComponent} from "../sidebar/sidebar.component";

@Component({
  selector: 'app-add-season',
  templateUrl: './add-season.component.html',
  styleUrls: ['./add-season.component.scss']
})
export class AddSeasonComponent implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  notifications: Array<AppNotification> = [];
  addForm: FormGroup;
  nameCtrl: FormControl = this.formBuilder.control('', [Validators.required]);
  deviceId: number;
  deviceName: string;
  pageNumber: number;

  constructor(private formBuilder: FormBuilder, private router: Router, private dataService: DataService,
    private route: ActivatedRoute, private tokenCheckService: TokenCheckService, public utilService: UtilService,
    private componentCommunicationService: ComponentCommunicationService) {
  	this.route.params.subscribe(params => this.deviceId = params.deviceid)
  }

  ngOnInit() {
  	if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
      return;
    }

    this.sidebar.setGoBackCallback(() => {
      this.componentCommunicationService.setPageNumber(this.constructor.name, this.pageNumber);
      this.router.navigate(['devices/' + this.deviceId + '/seasons']);
    });
    this.pageNumber = this.componentCommunicationService.getPageNumber(this.constructor.name);

    this.addForm = this.formBuilder.group({
    	name: this.nameCtrl
    });

    this.dataService.getDeviceName(this.deviceId).subscribe(
      apiResult => this.deviceName = apiResult.data.name
    );
  }

  onSubmit() {
  	if (this.addForm.invalid) {
      return;
    }

    let newSeason = new Season();
    newSeason.deviceId = this.deviceId;
    newSeason.name = this.addForm.controls['name'].value;

    this.dataService.createSeason(newSeason)
      .subscribe( data => {
        this.router.navigate(['devices/' + this.deviceId + '/seasons']);
      },
      error => {
        if (error.status === 400) {
          this.notifications = error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)});
        } else {
          this.componentCommunicationService.setNotification([new AppNotification('Unknown error', AppNotificationType.ERROR)]);
        }
      });
  }

  hasNotifications(): Boolean {
    return this.notifications.length > 0;
  }

}