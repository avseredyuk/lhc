import {BaseAuthComponent} from "../../base-auth/base-auth.component";
import {Component, OnInit, ViewChild} from "@angular/core";
import {ComponentCommunicationService} from "../../service/component-communication.service";
import {DataService} from "../../service/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AppNotification, AppNotificationType} from "../../model/app-notification";
import {TokenCheckService} from "../../service/token-check.service";
import {Crop, Statistics} from "../../model/season";
import {SidebarComponent} from "../../parts/sidebar/sidebar.component";
import {UtilService} from "../../service/util.service";

@Component({
  selector: 'app-season-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class SeasonViewComponent extends BaseAuthComponent implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  deviceId: number;
  seasonId: number;
  seasonName: string;
  pageNumber: number = 1;
  totalPages: number;
  cropsForSeason: Array<Crop> = [];
  stats: Statistics;

  constructor(public router: Router, private dataService: DataService, public componentCommunicationService: ComponentCommunicationService,
    private route: ActivatedRoute, public tokenCheckService: TokenCheckService, public utilService: UtilService) {
    super(router, componentCommunicationService, tokenCheckService);
    this.route.params.subscribe(params => this.deviceId = params.id);
    this.route.params.subscribe(params => this.seasonId = params.seasonid);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.sidebar.setGoBackCallback(() => {this.router.navigate(['devices/' + this.deviceId + '/seasons']);});

    const storedPageNumber = this.componentCommunicationService.getPageNumber(this.constructor.name);
    if (storedPageNumber !== undefined) {
      this.pageNumber = storedPageNumber;
    }

    this.loadPageForSeason();

    this.dataService.getSeasonStatistics(this.seasonId).subscribe(apiResult =>
      this.stats = apiResult.data
    );

    this.dataService.getSeasonName(this.seasonId).subscribe(apiResult =>
      this.seasonName = apiResult.data.name
    );
  }

  loadPageForSeason(): void {
    this.dataService.getCropsBySeasonId(this.seasonId, this.pageNumber - 1).subscribe(crops => {
      this.cropsForSeason = crops.content;
      this.totalPages = crops.totalPages;
    });
  }

  loadPage(p: number): void {
    this.pageNumber = p;
    this.loadPageForSeason();
  }

  addCrop(): void {
    this.componentCommunicationService.setPageNumber(this.constructor.name, this.pageNumber);
    this.router.navigate(['devices/' + this.deviceId + '/seasons/' + this.seasonId + '/crop/add']);
  }

  deleteCrop(cropId: number): void {
    if (confirm('Are you sure you want to delete crop?')) {
      this.dataService.deleteCrop(cropId).subscribe(data => {
        this.notificateThisPage([new AppNotification('Deleted crop: ' + cropId, AppNotificationType.SUCCESS)]);
        this.loadPageForSeason();
        this.dataService.getSeasonStatistics(this.seasonId).subscribe(apiResult =>
          this.stats = apiResult.data
        );
      });
    }
  }

  editCrop(cropId: number): void {
    this.componentCommunicationService.setPageNumber(this.constructor.name, this.pageNumber);
    this.router.navigate(['devices/' + this.deviceId + '/seasons/' + this.seasonId + '/crop/' + cropId + '/edit']);
  }

  hasData(): boolean {
    return typeof this.cropsForSeason !== 'undefined' && this.cropsForSeason.length > 0;
  }

  hasStatsData(): boolean {
    return typeof this.stats !== 'undefined';
  }

}
