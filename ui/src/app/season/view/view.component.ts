import {Component, OnInit, ViewChild, Renderer2} from "@angular/core";
import {ComponentCommunicationService} from "../../service/component-communication.service";
import {DataService} from "../../service/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Device} from "../../model/device";
import {AppNotification, AppNotificationType} from "../../model/app-notification";
import {TokenCheckService} from "../../service/token-check.service";
import {Crop, Season, Statistics} from "../../model/season";
import {SidebarComponent} from "../../parts/sidebar/sidebar.component";
import {ApiResult} from "../../model/api-result";
import {Page} from "../../model/page";
import {UtilService} from "../../service/util.service";

@Component({
  selector: 'app-season-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class SeasonViewComponent implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  notifications: Array<AppNotification> = [];
  deviceId: number;
  seasonId: number;
  seasonName: string;
  pageNumber: number = 1;
  totalPages: number;
  cropsForSeason: Array<Crop> = [];
  stats: Statistics;

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
    this.router.navigate(['devices/' + this.deviceId + '/seasons/' + this.seasonId + '/crop/add']);
  }

  deleteCrop(cropId: number) {
    if (confirm('Are you sure you want to delete crop?')) {
      this.dataService.deleteCrop(cropId).subscribe(
        data => {
          this.loadPageForSeason();
          this.dataService.getSeasonStatistics(this.seasonId).subscribe(apiResult => 
            this.stats = apiResult.data
          );
        }
      );
    }
  }

  editCrop(cropId: number) {
    this.componentCommunicationService.setPageNumber(this.constructor.name, this.pageNumber);
    this.router.navigate(['devices/' + this.deviceId + '/seasons/' + this.seasonId + '/crop/' + cropId + '/edit']);
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
