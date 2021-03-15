import {BasePageableStorable} from "../../base/base-pageable-storable";
import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../service/data.service";
import {ComponentCommunicationService} from "../../service/component-communication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AppNotification, AppNotificationType} from "../../model/app-notification";
import {TokenCheckService} from "../../service/token-check.service";
import {Season, Statistics} from "../../model/season";
import {SidebarComponent} from "../../parts/sidebar/sidebar.component";
import {UtilService} from "../../service/util.service";

@Component({
  selector: 'app-season-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class SeasonListComponent extends BasePageableStorable<Season> implements OnInit {
  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  deviceId: number;
  stats: Statistics;

  constructor(public router: Router, private dataService: DataService, public componentCommunicationService: ComponentCommunicationService,
    public tokenCheckService: TokenCheckService, private route: ActivatedRoute, public utilService: UtilService) {
    super(utilService.PAGINATED_COMPONENT_SEASON_LIST, router, componentCommunicationService, tokenCheckService);
    this.route.params.subscribe(params => this.deviceId = params.id)
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.sidebar.setGoBackCallback(() => this.router.navigate(['devices', this.deviceId]));
    this.dataService.getSeasonsStatistics(this.deviceId).subscribe(
      apiResult => this.stats = apiResult.data
    );
  }

  loadPageData(): void {
    this.dataService.getSeasonsByDeviceId(this.deviceId, this.pageNumber, this.pageSize).subscribe(seasons => {
      this.data = seasons.content;
      this.totalElements = seasons.totalElements;
    });
  }

  addSeason(): void {
    this.storePaginationInfo();
    this.router.navigate(['devices', this.deviceId, 'seasons', 'add']);
  }

  openSeason(season: Season): void {
  	this.storePaginationInfo();
  	this.router.navigate(['devices', this.deviceId, 'seasons', season.id]);
  }

  editSeason(season: Season): void {
    this.storePaginationInfo();
    this.router.navigate(['devices', this.deviceId, 'seasons', season.id, 'edit']);
  }

  deleteSeason(season: Season): void {
    if (confirm('Are you sure you want to delete season?')) {
      this.dataService.deleteSeason(season.id).subscribe(data => {
        this.notificateThisPage([new AppNotification('Deleted season: ' + season.name, AppNotificationType.SUCCESS)]);
        this.loadPageData();
        this.dataService.getSeasonsStatistics(this.deviceId).subscribe(apiResult =>
          this.stats = apiResult.data
        );
      });
    }
  }

  hasStatsData(): boolean {
    return typeof this.stats !== 'undefined';
  }

}
