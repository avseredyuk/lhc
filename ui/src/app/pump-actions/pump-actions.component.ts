import {BaseComponent} from "../base/base.component";
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AppNotification, AppNotificationType} from "../model/app-notification";
import {DataService} from "../service/data.service";
import {TokenCheckService} from "../service/token-check.service";
import {UtilService} from "../service/util.service";
import {PumpAction} from "../model/pump-action";
import {SidebarComponent} from "../parts/sidebar/sidebar.component";
import {ComponentCommunicationService} from "../service/component-communication.service";

@Component({
  selector: 'app-pump-actions',
  templateUrl: './pump-actions.component.html',
  styleUrls: ['./pump-actions.component.scss']
})
export class PumpActionsComponent extends BaseComponent implements OnInit {
  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  pumpActionsForDevice: Array<PumpAction> = [];
  totalPages: number;
  pageNumber: number = 1;
  deviceId: number;

  constructor(public router: Router, private dataService: DataService, private tokenCheckService: TokenCheckService,
  	private route: ActivatedRoute, public utilService: UtilService, public componentCommunicationService: ComponentCommunicationService) {
  	super(router, componentCommunicationService);
    this.route.params.subscribe(params => this.deviceId = params.id);
  }

  ngOnInit(): void {
    super.ngOnInit();
  	if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
      return;
    }
    this.sidebar.setGoBackCallback(() => {this.router.navigate(['devices/' + this.deviceId]);});
    this.loadPageForDevice();
  }

  loadPageForDevice(): void {
    this.dataService.getPumpActionsByDeviceId(this.deviceId, this.pageNumber - 1).subscribe(pumpActions => {
      this.pumpActionsForDevice = pumpActions.content;
      this.totalPages = pumpActions.totalPages;
    });
  }

  loadPage(p: number): void {
    this.pageNumber = p;
    this.loadPageForDevice();
  }

  deletePumpAction(pumpAction: PumpAction): void {
    if (confirm('Are you sure you want to delete pump action?')) {
      this.dataService.deletePumpAction(pumpAction).subscribe(data => {
        this.notificateThisPage([new AppNotification('Deleted pump action: ' + pumpAction.id, AppNotificationType.SUCCESS)]);
        this.loadPageForDevice();
      });
    }
  }

  hasData(): boolean {
    return typeof this.pumpActionsForDevice !== 'undefined' && this.pumpActionsForDevice.length > 0;
  }

}
