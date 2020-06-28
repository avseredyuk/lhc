import {Component, OnInit, ViewChildren, QueryList, Renderer, ViewChild} from "@angular/core";
import {ComponentCommunicationService} from "../component-communication.service";
import {DataService} from "../data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Device} from "../model/device";
import {AppNotification, AppNotificationType} from "../model/app-notification";
import {TokenCheckService} from "../token-check.service";
import {Crop, Season, SeasonStatistics} from "../model/season";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {ApiResult} from "../model/api-result";
import {Page} from "../model/page";
import {UtilService} from "../util.service";

@Component({
  selector: 'app-season',
  templateUrl: './season.component.html',
  styleUrls: ['./season.component.scss']
})
export class SeasonComponent implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  notifications: Array<AppNotification> = [];
  deviceId: number;
  seasonId: number;
  seasonName: string;
  pageNumber: number = 1;
  totalPages: number;
  @ViewChildren('tabHeader') tabHeaders: QueryList<any>;
  cropsForSeason: Array<Crop> = [];
  stats: SeasonStatistics;

  constructor(private router: Router, private dataService: DataService, private componentCommunicationService: ComponentCommunicationService,
    private route: ActivatedRoute, private tokenCheckService: TokenCheckService, public utilService: UtilService) {
    this.route.params.subscribe(params => this.deviceId = params.id);
    this.route.params.subscribe(params => this.seasonId = params.seasonid);
  }

  ngOnInit() {
    if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
      return;
    }

	this.notifications = this.componentCommunicationService.getNotification();

    this.sidebar.setGoBackCallback(() => {this.router.navigate(['devices/' + this.deviceId + '/seasons']);});

    let storedPageNumber = this.componentCommunicationService.getPageNumber(this.constructor.name);
    if (storedPageNumber !== undefined) {
      this.pageNumber = storedPageNumber;
    }

    this.loadPageForSeason();

    this.dataService.getSeasonStatistics(this.seasonId).subscribe(
      apiResult => this.stats = apiResult.data
    );

    this.dataService.getSeasonName(this.seasonId).subscribe(
      apiResult => this.seasonName = apiResult.data.name
   );
  }

  loadPageForSeason() {
    this.dataService.getCropsBySeasonId(this.seasonId, this.pageNumber - 1).subscribe(
      crops => {
        this.cropsForSeason = crops.content;
        this.totalPages = crops.totalPages;
      }
    );
  }

  loadPage(p) {
    this.pageNumber = p;
    this.loadPageForSeason();
  }

  addCrop() {
    this.componentCommunicationService.setPageNumber(this.constructor.name, this.pageNumber);
    this.router.navigate(['/add-crop/' + this.deviceId + '/' + this.seasonId]);
  }

  deleteCrop(cropId: number) {
    if (confirm('Are you sure you want to delete crop?')) {
      this.dataService.deleteCrop(cropId).subscribe(
        data => {
          this.loadPageForSeason();
        }
        );
    }
  }

  editCrop(cropId: number) {
    this.componentCommunicationService.setPageNumber(this.constructor.name, this.pageNumber);
    this.router.navigate(['/edit-crop/' + this.deviceId + '/' + this.seasonId + '/' + cropId]);
  }


  hasData(): Boolean {
    return typeof this.cropsForSeason !== 'undefined' && this.cropsForSeason.length > 0;
  }

  hasStatsData(): Boolean {
    return typeof this.stats !== 'undefined';
  }

  hasNotifications(): Boolean {
    return typeof this.notifications !== 'undefined' && this.notifications.length > 0;
  }

}
