import {BaseAuth} from "../../base/base-auth";
import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../service/data.service";
import {AppNotification, AppNotificationType} from "../../model/app-notification";
import {Crop} from "../../model/season";
import {TokenCheckService} from "../../service/token-check.service";
import {UtilService} from "../../service/util.service";
import {ComponentCommunicationService} from "../../service/component-communication.service";
import {SidebarComponent} from "../../parts/sidebar/sidebar.component";

@Component({
  selector: 'app-crop-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class CropAddComponent extends BaseAuth implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  addForm: FormGroup;
  weightCtrl: FormControl = this.formBuilder.control('', [Validators.required, Validators.pattern(this.utilService.VALIDATION_PATTERN_WEIGHT)]);
  countCtrl: FormControl = this.formBuilder.control('', [Validators.required, Validators.pattern(this.utilService.VALIDATION_PATTERN_COUNT)]);
  seasonName: string;
  deviceId: number;
  seasonId: number;

  constructor(private formBuilder: FormBuilder, public router: Router, private dataService: DataService,
    private route: ActivatedRoute, public tokenCheckService: TokenCheckService, public utilService: UtilService,
    public componentCommunicationService: ComponentCommunicationService) {
  	super(router, componentCommunicationService, tokenCheckService);
    this.route.params.subscribe(params => this.deviceId = params.id)
  	this.route.params.subscribe(params => this.seasonId = params.seasonid)
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.sidebar.setGoBackCallback(() => this.router.navigate(['devices', this.deviceId, 'seasons', this.seasonId]));

    this.addForm = this.formBuilder.group({
    	weight: this.weightCtrl,
    	count: this.countCtrl,
    });

    this.dataService.getSeasonName(this.seasonId).subscribe(
      apiResult => this.seasonName = apiResult.data.name
   );
  }

  onSubmit(): void {
  	if (this.addForm.invalid) {
      return;
    }

    const newCrop = new Crop();
    newCrop.seasonId = this.seasonId;
    newCrop.weight = this.addForm.controls['weight'].value;
    newCrop.count = this.addForm.controls['count'].value;

    this.dataService.createCrop(newCrop).subscribe( data => {
      this.navigateWithNotification(['devices,', this.deviceId, 'seasons', this.seasonId], [new AppNotification('Success', AppNotificationType.SUCCESS)]);
    }, error => {
      let errNotification;
      if (error.status === 400 && error.error !== null) {
        errNotification = error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)});
      } else {
        errNotification = [new AppNotification('Unknown error', AppNotificationType.ERROR)];
      }
      this.navigateWithNotification(['devices', this.deviceId, 'seasons', this.seasonId], errNotification);
    });
  }
}
