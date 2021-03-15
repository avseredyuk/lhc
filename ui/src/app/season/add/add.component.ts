import {BaseAuth} from "../../base/base-auth";
import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../service/data.service";
import {AppNotification, AppNotificationType} from "../../model/app-notification";
import {Season} from "../../model/season";
import {TokenCheckService} from "../../service/token-check.service";
import {UtilService} from "../../service/util.service";
import {ComponentCommunicationService} from "../../service/component-communication.service";
import {SidebarComponent} from "../../parts/sidebar/sidebar.component";

@Component({
  selector: 'app-season-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class SeasonAddComponent extends BaseAuth implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  addForm: FormGroup;
  nameCtrl: FormControl = this.formBuilder.control('', [Validators.required]);
  deviceId: number;

  constructor(private formBuilder: FormBuilder, public router: Router, private dataService: DataService,
    private route: ActivatedRoute, public tokenCheckService: TokenCheckService, public utilService: UtilService,
    public componentCommunicationService: ComponentCommunicationService) {
    super(router, componentCommunicationService, tokenCheckService);
  	this.route.params.subscribe(params => this.deviceId = params.id)
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.sidebar.setGoBackCallback(() => this.router.navigate(['devices', this.deviceId, 'seasons']));

    this.addForm = this.formBuilder.group({
    	name: this.nameCtrl
    });
  }

  onSubmit(): void {
  	if (this.addForm.invalid) {
      return;
    }

    const newSeason = new Season();
    newSeason.deviceId = this.deviceId;
    newSeason.name = this.addForm.controls['name'].value;

    this.dataService.createSeason(newSeason).subscribe(data => {
      this.navigateWithNotification(['devices', this.deviceId, 'seasons'], [new AppNotification('Success', AppNotificationType.SUCCESS)]);
    }, error => {
      if (error.status === 400) {
        this.notificateThisPage(error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)}));
      } else {
        this.notificateThisPage([new AppNotification('Unknown error', AppNotificationType.ERROR)]);
      }
    });
  }

}
