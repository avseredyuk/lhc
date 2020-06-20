import {Component, OnInit, ViewChildren, QueryList, ViewChild} from '@angular/core';
import {DataService} from "../data.service";
import {ComponentCommunicationService} from "../component-communication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AppNotification, AppNotificationType} from "../model/app-notification";
import {TokenCheckService} from "../token-check.service";
import {Season} from "../model/season";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {UtilService} from "../util.service";

@Component({
  selector: 'app-seasons',
  templateUrl: './seasons.component.html',
  styleUrls: ['./seasons.component.scss']
})
export class SeasonsComponent implements OnInit {

  notifications: Array<AppNotification> = [];
  seasons: Season[];
  deviceId: number;
  pageNumber: number = 1;
  totalPages: number;
  @ViewChildren('tabHeader') tabHeaders: QueryList<any>;
  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  deviceName: string;

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

    let storedPageNumber = this.componentCommunicationService.getPageNumber();
    if (storedPageNumber !== undefined) {
      this.pageNumber = storedPageNumber;
    }

    this.loadPageForDevice();

    this.notifications = this.componentCommunicationService.getNotification();
    this.dataService.getDeviceName(this.deviceId).subscribe(
      apiResult => this.deviceName = apiResult.data.name
    );
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
    this.componentCommunicationService.setPageNumber(this.pageNumber);
    this.router.navigate(['/add-season/' + this.deviceId]);
  }

  openSeason(seasonId) {
  	this.componentCommunicationService.setPageNumber(this.pageNumber);
  	this.router.navigate(['/devices/' + this.deviceId + '/seasons/' + seasonId]);
  }

  hasData(): Boolean {
    return typeof this.seasons !== 'undefined' && this.seasons.length > 0;
  }

  hasNotifications(): Boolean {
    return typeof this.notifications !== 'undefined' && this.notifications.length > 0;
  }

}
