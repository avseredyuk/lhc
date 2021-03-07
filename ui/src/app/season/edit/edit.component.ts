import {BaseAuthComponent} from "../../base-auth/base-auth.component";
import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../service/data.service";
import {Season} from "../../model/season";
import {ApiResult} from "../../model/api-result";
import {ComponentCommunicationService} from "../../service/component-communication.service";
import {AppNotification, AppNotificationType} from "../../model/app-notification";
import {TokenCheckService} from "../../service/token-check.service";
import {UtilService} from "../../service/util.service";
import {SidebarComponent} from "../../parts/sidebar/sidebar.component";

@Component({
  selector: 'app-season-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class SeasonEditComponent extends BaseAuthComponent implements OnInit {

 @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  cropId: number;
  season: Season;
  editForm: FormGroup;
  nameCtrl: FormControl = this.formBuilder.control('', [Validators.required, Validators.pattern(this.utilService.VALIDATION_PATTERN_SEASON_NAME)]);
  seasonId: number;
  deviceId: number;
  pageNumber: number;

  constructor(private formBuilder: FormBuilder, public router: Router, private dataService: DataService, private route: ActivatedRoute,
  	public componentCommunicationService: ComponentCommunicationService, public tokenCheckService: TokenCheckService, private utilService: UtilService) {
  	super(router, componentCommunicationService, tokenCheckService);
    this.route.params.subscribe(params => {
      this.seasonId = params.seasonid;
      this.deviceId = params.id;
    })
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.sidebar.setGoBackCallback(() => {
      this.componentCommunicationService.setPageNumber(this.constructor.name, this.pageNumber);
      this.router.navigate(['devices/' + this.deviceId + '/seasons']);
    });
    this.pageNumber = this.componentCommunicationService.getPageNumber(this.constructor.name);

    this.editForm = this.formBuilder.group({
    	name: this.nameCtrl
    });

    this.dataService.getSeason(this.seasonId).subscribe((data: ApiResult<Season>) => {
      this.season = data.data;
      this.editForm.controls['name'].setValue(this.season.name);
    }, error => {
      let errNotification;
      if (error.status === 400) {
        errNotification = error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)});
      } else {
        errNotification = [new AppNotification('Unknown error', AppNotificationType.ERROR)];
      }
      this.navigateWithNotification('devices/' + this.deviceId + '/seasons', errNotification);
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      return;
    }

    this.season.name = this.editForm.controls['name'].value;
    this.season.deviceId = this.deviceId;
    this.dataService.updateSeason(this.season).subscribe(data => {
      this.navigateWithNotification('devices/' + this.deviceId + '/seasons', [new AppNotification('Success', AppNotificationType.SUCCESS)]);
    }, error => {
      if (error.status === 400) {
        this.notificateThisPage(error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)}));
      } else {
        this.notificateThisPage([new AppNotification('Unknown error', AppNotificationType.ERROR)]);
      }
    });
  }
}
