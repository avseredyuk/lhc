import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AppNotification} from "../model/app-notification";
import {DataService} from "../data.service";
import {TokenCheckService} from "../token-check.service";
import {UtilService} from "../util.service";
import {PumpAction} from "../model/pump-action";

@Component({
  selector: 'app-pump-actions',
  templateUrl: './pump-actions.component.html',
  styleUrls: ['./pump-actions.component.scss']
})
export class PumpActionsComponent {
  pumpActionsForDevice: Array<PumpAction> = [];
  notifications: Array<AppNotification> = [];
  pages: Array<number> = [];
  pageNumber: number = 1;
  deviceId: number;
  deviceName: string;

  constructor(private router: Router, private dataService: DataService, private tokenCheckService: TokenCheckService,
  	private route: ActivatedRoute, private utilService: UtilService) {
  	this.route.params.subscribe(params => this.deviceId = params.id);
  }

  ngOnInit() {
  	if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
      return;
    }
    this.loadPageForDevice();
    this.dataService.getDevice(this.deviceId).subscribe(
    	apiResult => this.deviceName = apiResult.data.name
    );
  }

  loadPageForDevice() {
    this.dataService.getPumpActionsByDeviceId(this.deviceId, this.pageNumber - 1).subscribe(
      pumpActions => {
        this.pumpActionsForDevice = pumpActions.content;

        this.pages = [];
        for (var i = 1; i <= pumpActions.totalPages; i++) {
          this.pages.push(i);
        }
      }
    );
  }

  isCurrentPage(p) {
    return p == this.pageNumber;
  }

  loadPage(p) {
    this.pageNumber = p;
    this.loadPageForDevice();
  }

  hasNotifications(): Boolean {
    return this.notifications.length > 0;
  }

}
