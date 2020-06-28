import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../data.service";
import {AppNotification, AppNotificationType} from "../model/app-notification";
import {Device} from "../model/device";
import {Crop, Season} from "../model/season";
import {TokenCheckService} from "../token-check.service";
import {UtilService} from "../util.service";
import {ComponentCommunicationService} from "../component-communication.service";
import {SidebarComponent} from "../sidebar/sidebar.component";

@Component({
  selector: 'app-add-crop',
  templateUrl: './add-crop.component.html',
  styleUrls: ['./add-crop.component.scss']
})
export class AddCropComponent implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  notifications: Array<AppNotification> = [];
  addForm: FormGroup;
  weightCtrl: FormControl = this.formBuilder.control('', [Validators.required, Validators.pattern(this.utilService.VALIDATION_PATTERN_WEIGHT)]);
  countCtrl: FormControl = this.formBuilder.control('', [Validators.required, Validators.pattern(this.utilService.VALIDATION_PATTERN_COUNT)]);
  seasonName: string;
  deviceId: number;
  seasonId: number;
  deviceName: string;
  pageNumber: number;

  constructor(private formBuilder: FormBuilder, private router: Router, private dataService: DataService,
    private route: ActivatedRoute, private tokenCheckService: TokenCheckService, public utilService: UtilService,
    private componentCommunicationService: ComponentCommunicationService) {
  	this.route.params.subscribe(params => this.deviceId = params.deviceid)
  	this.route.params.subscribe(params => this.seasonId = params.seasonid)
  }

  ngOnInit() {
  	if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
      return;
    }

    this.sidebar.setGoBackCallback(() => {
      this.componentCommunicationService.setPageNumber(this.constructor.name, this.pageNumber);
      this.router.navigate(['devices/' + this.deviceId + '/seasons/' + this.seasonId]);
    });
    this.pageNumber = this.componentCommunicationService.getPageNumber(this.constructor.name);

    this.addForm = this.formBuilder.group({
    	weight: this.weightCtrl,
    	count: this.countCtrl,
    });

    this.dataService.getSeasonName(this.seasonId).subscribe(
      apiResult => this.seasonName = apiResult.data.name
   );
  }

  onSubmit() {
  	if (this.addForm.invalid) {
      return;
    }

    let newCrop = new Crop();
    newCrop.seasonId = this.seasonId;
    newCrop.weight = this.addForm.controls['weight'].value;
    newCrop.count = this.addForm.controls['count'].value;

    this.dataService.createCrop(newCrop)
      .subscribe( data => {
        this.router.navigate(['devices/' + this.deviceId + '/seasons/' + this.seasonId]);
      },
      error => {
        if (error.status === 400) {
          if (error.error !== null) {
          	this.notifications = error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)});
          } else {
          	this.componentCommunicationService.setNotification([new AppNotification('Unknown error', AppNotificationType.ERROR)]);
          }
        } else {
          this.componentCommunicationService.setNotification([new AppNotification('Unknown error', AppNotificationType.ERROR)]);
        }
        this.router.navigate(['devices/' + this.deviceId + '/seasons/' + this.seasonId]);
      });
  }

  hasNotifications(): Boolean {
    return this.notifications.length > 0;
  }

}
