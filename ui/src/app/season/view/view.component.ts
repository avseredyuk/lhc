import {BasePageableStorable} from "../../base/base-pageable-storable";
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
export class SeasonViewComponent extends BasePageableStorable<Crop> implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  deviceId: number;
  seasonId: number;
  seasonName: string;
  stats: Statistics;

  constructor(public router: Router, private dataService: DataService, public componentCommunicationService: ComponentCommunicationService,
    private route: ActivatedRoute, public tokenCheckService: TokenCheckService, public utilService: UtilService) {
    super(utilService.PAGINATED_COMPONENT_SEASON_VIEW, router, componentCommunicationService, tokenCheckService);
    this.route.params.subscribe(params => { 
      this.deviceId = params.id;
      this.seasonId = params.seasonid;
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.sidebar.setGoBackCallback(() => this.router.navigate(['devices', this.deviceId, 'seasons']));
    this.dataService.getSeasonStatistics(this.seasonId).subscribe(apiResult =>
      this.stats = apiResult.data
    );
    this.dataService.getSeasonName(this.seasonId).subscribe(apiResult =>
      this.seasonName = apiResult.data.name
    );
  }

  loadPageData(): void {
    this.dataService.getCropsBySeasonId(this.seasonId, this.pageNumber, this.pageSize).subscribe(crops => {
      this.data = crops.content;
      this.totalElements = crops.totalElements;
    });
  }

  addCrop(): void {
    this.storePaginationInfo();
    this.router.navigate(['devices', this.deviceId, 'seasons', this.seasonId, 'crop', 'add']);
  }

  deleteCrop(cropId: number): void {
    if (confirm('Are you sure you want to delete crop?')) {
      this.dataService.deleteCrop(cropId).subscribe(data => {
        this.notificateThisPage([new AppNotification('Deleted crop: ' + cropId, AppNotificationType.SUCCESS)]);
        this.loadPageData();
        this.dataService.getSeasonStatistics(this.seasonId).subscribe(apiResult =>
          this.stats = apiResult.data
        );
      });
    }
  }

  editCrop(cropId: number): void {
    this.storePaginationInfo();
    this.router.navigate(['devices', this.deviceId, 'seasons', this.seasonId, 'crop', cropId, 'edit']);
  }

  hasStatsData(): boolean {
    return typeof this.stats !== 'undefined';
  }

}
