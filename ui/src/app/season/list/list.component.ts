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
export class SeasonListComponent implements OnInit {

  notifications: Array<AppNotification> = [];
  seasons: Season[];
  deviceId: number;
  pageNumber: number = 1;
  totalPages: number;
  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  stats: Statistics;

  constructor(private router: Router, private dataService: DataService, private componentCommunicationService: ComponentCommunicationService,
    private tokenCheckService: TokenCheckService, private route: ActivatedRoute, public utilService: UtilService) {
    this.route.params.subscribe(params => this.deviceId = params.id)
  }

  ngOnInit() {
  	if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
      return;
    }
    this.sidebar.setGoBackCallback(() => {this.router.navigate(['devices/' + this.deviceId]);});

    let storedPageNumber = this.componentCommunicationService.getPageNumber(this.constructor.name);
    if (storedPageNumber !== undefined) {
      this.pageNumber = storedPageNumber;
    }

    this.loadPageForDevice();

    this.dataService.getSeasonsStatistics(this.deviceId).subscribe(
      apiResult => this.stats = apiResult.data
    );

    this.notifications = this.componentCommunicationService.getNotification();
  }

  loadPageForDevice() {
    this.dataService.getSeasonsByDeviceId(this.deviceId, this.pageNumber - 1).subscribe(
      seasons => {
        this.seasons = seasons.content;
        this.totalPages = seasons.totalPages;
      }
    );
  }

  loadPage(p) {
    this.pageNumber = p;
    this.loadPageForDevice();
  }

  addSeason() {
    this.componentCommunicationService.setPageNumber(this.constructor.name, this.pageNumber);
    this.router.navigate(['devices/' + this.deviceId + '/seasons/add']);
  }

  openSeason(season: Season) {
  	this.componentCommunicationService.setPageNumber(this.constructor.name, this.pageNumber);
  	this.router.navigate(['devices/' + this.deviceId + '/seasons/' + season.id]);
  }

  editSeason(season: Season) {
    this.componentCommunicationService.setPageNumber(this.constructor.name, this.pageNumber);
    this.router.navigate(['devices/' + this.deviceId + '/seasons/' + season.id + '/edit']);
  }

  deleteSeason(season: Season) {
    if (confirm('Are you sure you want to delete season?')) {
      this.dataService.deleteSeason(season.id).subscribe(
        data => {
          this.loadPageForDevice();
          this.dataService.getSeasonsStatistics(this.deviceId).subscribe(apiResult => 
            this.stats = apiResult.data
          );
        }
      );
    }
  }

  hasData(): Boolean {
    return typeof this.seasons !== 'undefined' && this.seasons.length > 0;
  }

  hasStatsData(): Boolean {
    return typeof this.stats !== 'undefined';
  }

  hasNotifications(): Boolean {
    return typeof this.notifications !== 'undefined' && this.notifications.length > 0;
  }

}
