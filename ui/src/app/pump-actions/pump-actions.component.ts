import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AppNotification} from "../model/app-notification";
import {DataService} from "../service/data.service";
import {TokenCheckService} from "../service/token-check.service";
import {UtilService} from "../service/util.service";
import {PumpAction} from "../model/pump-action";
import {SidebarComponent} from "../parts/sidebar/sidebar.component";

@Component({
  selector: 'app-pump-actions',
  templateUrl: './pump-actions.component.html',
  styleUrls: ['./pump-actions.component.scss']
})
export class PumpActionsComponent {
  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  pumpActionsForDevice: Array<PumpAction> = [];
  notifications: Array<AppNotification> = [];
  totalPages: number;
  pageNumber: number = 1;
  deviceId: number;

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
  }

  loadPageForDevice() {
    this.dataService.getPumpActionsByDeviceId(this.deviceId, this.pageNumber - 1).subscribe(
      pumpActions => {
        this.pumpActionsForDevice = pumpActions.content;
        this.totalPages = pumpActions.totalPages;
      }
    );
  }

  loadPage(p) {
    this.pageNumber = p;
    this.loadPageForDevice();
  }

  deletePumpAction(pumpAction: PumpAction) {
    if (confirm('Are you sure you want to delete pump action?')) {
      this.dataService.deletePumpAction(pumpAction).subscribe(
        data => {
          this.loadPageForDevice();
        }
        );
    }
  }

  hasData(): Boolean {
    return typeof this.pumpActionsForDevice !== 'undefined' && this.pumpActionsForDevice.length > 0;
  }

  hasNotifications(): Boolean {
    return this.notifications.length > 0;
  }

}
