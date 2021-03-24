import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BasePageable} from "../base/base-pageable";
import {Bootup} from "../model/bootup";
import {ComponentCommunicationService} from "../service/component-communication.service";
import {DataService} from "../service/data.service";
import {TokenCheckService} from "../service/token-check.service";
import {UtilService} from "../service/util.service";
import {SidebarComponent} from "../parts/sidebar/sidebar.component";
import {Observable} from "rxjs";
import {Page} from "../model/page";

@Component({
  selector: 'app-bootups',
  templateUrl: './bootups.component.html',
  styleUrls: ['./bootups.component.scss']
})
export class BootupsComponent extends BasePageable<Bootup> implements OnInit {
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

  providePageData(): Observable<Page<Bootup>> {
    return this.dataService.getBootupsByDeviceId(this.deviceId, this.pageNumber, this.pageSize);
  }

  deleteBootup(bootup: Bootup): void {
    if (confirm('Are you sure you want to delete bootup?')) {
      this.dataService.deleteBootup(bootup).subscribe(
        data => {
          this.loadPageData();
        }
      );
    }
  }

}
