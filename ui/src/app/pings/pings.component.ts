import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Ping} from "../model/ping";
import {AppNotification} from "../model/app-notification";
import {DataService} from "../data.service";
import {TokenCheckService} from "../token-check.service";
import {UtilService} from "../util.service";
import {SidebarComponent} from "../sidebar/sidebar.component";

@Component({
  selector: 'app-pings',
  templateUrl: './pings.component.html',
  styleUrls: ['./pings.component.scss']
})
export class PingsComponent implements OnInit {
  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  pingsForDevice: Array<Ping> = [];
  notifications: Array<AppNotification> = [];
  totalPages: number;
  pageNumber: number = 1;
  deviceId: number;
  deviceName: string;

  constructor(private router: Router, private dataService: DataService, private tokenCheckService: TokenCheckService,
  	private route: ActivatedRoute, public utilService: UtilService) {
  	this.route.params.subscribe(params => this.deviceId = params.id);
  }

  ngOnInit() {
  	if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
      return;
    }
    this.sidebar.setGoBackCallback(() => {this.router.navigate(['devices/' + this.deviceId]);});
    this.loadPageForDevice();
    this.dataService.getDevice(this.deviceId).subscribe(
    	apiResult => this.deviceName = apiResult.data.name
    );
  }

  loadPageForDevice() {
    this.dataService.getPingsByDeviceId(this.deviceId, this.pageNumber - 1).subscribe(
      pings => {
        this.pingsForDevice = pings.content;
        this.totalPages = pings.totalPages;
      }
    );
  }

  loadPage(p) {
    this.pageNumber = p;
    this.loadPageForDevice();
  }

  hasNotifications(): Boolean {
    return this.notifications.length > 0;
  }

}
