import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../service/data.service";
import {Season} from "../../model/season";
import {ApiResult} from "../../model/api-result";
import {Device} from "../../model/device";
import {ComponentCommunicationService} from "../../service/component-communication.service";
import {AppNotification, AppNotificationType} from "../../model/app-notification";
import {TokenCheckService} from "../../service/token-check.service";
import {UtilService} from "../../service/util.service";
import {SidebarComponent} from "../../sidebar/sidebar.component";

@Component({
  selector: 'app-season-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class SeasonEditComponent implements OnInit {

 @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  cropId: number;
  season: Season;
  notifications: Array<AppNotification> = [];
  editForm: FormGroup;
  nameCtrl: FormControl = this.formBuilder.control('', [Validators.required, Validators.pattern(this.utilService.VALIDATION_PATTERN_SEASON_NAME)]);
  seasonId: number;
  deviceId: number;
  deviceName: string;
  pageNumber: number;

    constructor(private formBuilder: FormBuilder, private router: Router, private dataService: DataService, private route: ActivatedRoute,
  	private componentCommunicationService: ComponentCommunicationService, private tokenCheckService: TokenCheckService, private utilService: UtilService) {
  	this.route.params.subscribe(params => {
      this.seasonId = params.seasonid;
      this.deviceId = params.id;
    })
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

    this.editForm = this.formBuilder.group({
    	name: this.nameCtrl
    });

    this.dataService.getSeason(this.seasonId).subscribe(
      (data: ApiResult<Season>) => {
        this.season = data.data;
        this.editForm.controls['name'].setValue(this.season.name);
      },
      error => {
        if (error.status === 400) {
          this.notifications = error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)});
        } else {
          this.componentCommunicationService.setNotification([new AppNotification('Unknown error', AppNotificationType.ERROR)]);
        }
        this.router.navigate(['devices/' + this.deviceId + '/seasons']);
      }
    );
    this.dataService.getDeviceName(this.deviceId).subscribe(
      apiResult => this.deviceName = this.utilService.formatDeviceName(apiResult.data.name, apiResult.data.privateName)
    );
  }

  onSubmit() {
    if (this.editForm.invalid) {
      return;
    }
    
    this.season.name = this.editForm.controls['name'].value;
    this.season.deviceId = this.deviceId;
    this.dataService.updateSeason(this.season)
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
