import {BaseAuth} from "../../base/base-auth";
import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../service/data.service";
import {Crop} from "../../model/season";
import {ApiResult} from "../../model/api-result";
import {ComponentCommunicationService} from "../../service/component-communication.service";
import {AppNotification, AppNotificationType} from "../../model/app-notification";
import {TokenCheckService} from "../../service/token-check.service";
import {UtilService} from "../../service/util.service";
import {SidebarComponent} from "../../parts/sidebar/sidebar.component";

@Component({
  selector: 'app-crop-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class CropEditComponent extends BaseAuth implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  cropId: number;
  crop: Crop;
  editForm: FormGroup;
  weightCtrl: FormControl = this.formBuilder.control('', [Validators.required, Validators.pattern(this.utilService.VALIDATION_PATTERN_WEIGHT)]);
  countCtrl: FormControl = this.formBuilder.control('', [Validators.required, Validators.pattern(this.utilService.VALIDATION_PATTERN_COUNT)]);
  dateCtrl: FormControl = this.formBuilder.control('', [Validators.required]);
  timeCtrl: FormControl = this.formBuilder.control('', [Validators.required]);
  seasonId: number;
  deviceId: number;
  seasonName: string;
  newDate: Date;
  newTime: Date;

  constructor(private formBuilder: FormBuilder, public router: Router, private dataService: DataService, private route: ActivatedRoute,
  	public componentCommunicationService: ComponentCommunicationService, public tokenCheckService: TokenCheckService, private utilService: UtilService) {
  	super(router, componentCommunicationService, tokenCheckService);
    this.route.params.subscribe(params => {
      this.cropId = params.cropid;
      this.seasonId = params.seasonid;
      this.deviceId = params.id;
    })
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.sidebar.setGoBackCallback(() => this.router.navigate(['devices', this.deviceId, 'seasons', this.seasonId]));

    this.editForm = this.formBuilder.group({
    	weight: this.weightCtrl,
      count: this.countCtrl,
      date: this.dateCtrl,
      time: this.timeCtrl
    });

    this.dataService.getCrop(this.cropId).subscribe((data: ApiResult<Crop>) => {
      this.crop = data.data;
      this.editForm.controls['weight'].setValue(this.crop.weight);
      this.editForm.controls['count'].setValue(this.crop.count)
      this.editForm.controls['date'].setValue(this.utilService.getDateFromDateTime(this.crop.d));
      this.editForm.controls['time'].setValue(this.utilService.getTimeFromDateTime(this.crop.d));
      this.newDate = new Date(this.crop.d);
      this.newTime = new Date(this.crop.d);
    }, error => {
      let errNotification;
      if (error.status === 400) {
        errNotification = error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)});
      } else {
        errNotification = [new AppNotification('Unknown error', AppNotificationType.ERROR)];
      }
      this.navigateWithNotification(['devices', this.deviceId, 'seasons', this.seasonId], errNotification);
    }
    );
    this.dataService.getSeasonName(this.seasonId).subscribe(
      apiResult => this.seasonName = apiResult.data.name
    );
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      return;
    }
    if (this.newDate === null || this.newTime === null) {
    	return;
    }
    this.crop.weight = parseFloat(this.editForm.controls['weight'].value);
    this.crop.count = parseFloat(this.editForm.controls['count'].value);
    this.crop.d = this.utilService.combineDateAndTime(this.newDate, this.newTime).getTime();
    this.crop.seasonId = this.seasonId;
    this.dataService.updateCrop(this.crop).subscribe(data => {
      this.navigateWithNotification(['devices', this.deviceId, 'seasons', this.seasonId], [new AppNotification('Success', AppNotificationType.SUCCESS)]);
    });
  }

}
