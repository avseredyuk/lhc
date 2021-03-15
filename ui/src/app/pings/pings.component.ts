import {BasePageable} from "../base/base-pageable";
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ComponentCommunicationService} from "../service/component-communication.service";
import {Ping} from "../model/ping";
import {DataService} from "../service/data.service";
import {TokenCheckService} from "../service/token-check.service";
import {UtilService} from "../service/util.service";
import {SidebarComponent} from "../parts/sidebar/sidebar.component";
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-pings',
  templateUrl: './pings.component.html',
  styleUrls: ['./pings.component.scss']
})
export class PingsComponent extends BasePageable<Ping> implements OnInit {
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
    this.dataService.getPingsByDeviceId(this.deviceId, this.pageNumber, this.pageSize).subscribe(pings => {
      this.data = pings.content;
      this.totalElements = pings.totalElements;
    });
  }
}
