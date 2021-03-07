import {BaseAuthComponent} from "../base-auth/base-auth.component";
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ComponentCommunicationService} from "../service/component-communication.service";
import {Ping} from "../model/ping";
import {DataService} from "../service/data.service";
import {TokenCheckService} from "../service/token-check.service";
import {UtilService} from "../service/util.service";
import {SidebarComponent} from "../parts/sidebar/sidebar.component";

@Component({
  selector: 'app-pings',
  templateUrl: './pings.component.html',
  styleUrls: ['./pings.component.scss']
})
export class PingsComponent extends BaseAuthComponent implements OnInit {
  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  pingsForDevice: Array<Ping> = [];
  totalPages: number;
  pageNumber: number = 1;
  deviceId: number;

  constructor(public router: Router, private dataService: DataService, public tokenCheckService: TokenCheckService,
  	private route: ActivatedRoute, public utilService: UtilService, public componentCommunicationService: ComponentCommunicationService) {
  	super(router, componentCommunicationService, tokenCheckService);
    this.route.params.subscribe(params => this.deviceId = params.id);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.sidebar.setGoBackCallback(() => {this.router.navigate(['devices/' + this.deviceId]);});
    this.loadPageForDevice();
  }

  loadPageForDevice(): void {
    this.dataService.getPingsByDeviceId(this.deviceId, this.pageNumber - 1).subscribe(pings => {
      this.pingsForDevice = pings.content;
      this.totalPages = pings.totalPages;
    });
  }

  loadPage(p: number): void {
    this.pageNumber = p;
    this.loadPageForDevice();
  }

  hasData(): boolean {
    return typeof this.pingsForDevice !== 'undefined' && this.pingsForDevice.length > 0;
  }
}
