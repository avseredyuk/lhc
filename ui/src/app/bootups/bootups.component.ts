import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BaseComponent} from "../base/base.component";
import {Bootup} from "../model/bootup";
import {ComponentCommunicationService} from "../service/component-communication.service";
import {DataService} from "../service/data.service";
import {TokenCheckService} from "../service/token-check.service";
import {UtilService} from "../service/util.service";
import {SidebarComponent} from "../parts/sidebar/sidebar.component";


@Component({
  selector: 'app-bootups',
  templateUrl: './bootups.component.html',
  styleUrls: ['./bootups.component.scss']
})
export class BootupsComponent extends BaseComponent implements OnInit {

  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  bootupsForDevice: Array<Bootup> = [];
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
    this.dataService.getBootupsByDeviceId(this.deviceId, this.pageNumber - 1).subscribe(
      bootups => {
        this.bootupsForDevice = bootups.content;
        this.totalPages = bootups.totalPages;
      }
    );
  }

  loadPage(p: number): void {
    this.pageNumber = p;
    this.loadPageForDevice();
  }

  deleteBootup(bootup: Bootup): void {
    if (confirm('Are you sure you want to delete bootup?')) {
      this.dataService.deleteBootup(bootup).subscribe(
        data => {
          this.loadPageForDevice();
        }
      );
    }
  }

  hasData(): boolean {
    return typeof this.bootupsForDevice !== 'undefined' && this.bootupsForDevice.length > 0;
  }

}
