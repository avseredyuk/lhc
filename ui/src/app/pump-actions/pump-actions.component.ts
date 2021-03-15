import {BasePageable} from "../base/base-pageable";
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AppNotification, AppNotificationType} from "../model/app-notification";
import {DataService} from "../service/data.service";
import {TokenCheckService} from "../service/token-check.service";
import {UtilService} from "../service/util.service";
import {PumpAction} from "../model/pump-action";
import {SidebarComponent} from "../parts/sidebar/sidebar.component";
import {ComponentCommunicationService} from "../service/component-communication.service";
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-pump-actions',
  templateUrl: './pump-actions.component.html',
  styleUrls: ['./pump-actions.component.scss']
})
export class PumpActionsComponent extends BasePageable<PumpAction> implements OnInit {
  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  deviceId: number;

  constructor(public router: Router, private dataService: DataService, public tokenCheckService: TokenCheckService,
  	private route: ActivatedRoute, public utilService: UtilService, public componentCommunicationService: ComponentCommunicationService) {
  	super(router, componentCommunicationService, tokenCheckService);
    this.route.params.subscribe(params => this.deviceId = params.id);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.sidebar.setGoBackCallback(() => this.router.navigate(['devices', this.deviceId]));
    this.loadPageData();
  }

  loadPageData(): void {
    this.dataService.getPumpActionsByDeviceId(this.deviceId, this.pageNumber, this.pageSize).subscribe(pumpActions => {
      this.data = pumpActions.content;
      this.totalElements = pumpActions.totalElements;
    });
  }

  deletePumpAction(pumpAction: PumpAction): void {
    if (confirm('Are you sure you want to delete pump action?')) {
      this.dataService.deletePumpAction(pumpAction).subscribe(data => {
        this.notificateThisPage([new AppNotification('Deleted pump action: ' + pumpAction.id, AppNotificationType.SUCCESS)]);
        this.loadPageData();
      });
    }
  }

}
