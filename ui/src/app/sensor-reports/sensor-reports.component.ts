import {BasePageable} from "../base/base-pageable";
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AppNotification, AppNotificationType} from "../model/app-notification";
import {DataService} from "../service/data.service";
import {TokenCheckService} from "../service/token-check.service";
import {UtilService} from "../service/util.service";
import {SensorReport} from "../model/sensor-report";
import {SidebarComponent} from "../parts/sidebar/sidebar.component";
import {ComponentCommunicationService} from "../service/component-communication.service";
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-sensor-reports',
  templateUrl: './sensor-reports.component.html',
  styleUrls: ['./sensor-reports.component.scss']
})
export class SensorReportsComponent extends BasePageable<SensorReport> implements OnInit {
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
    this.dataService.getSensorReportsByDeviceId(this.deviceId, this.pageNumber, this.pageSize).subscribe(sensorReports => {
      this.data = sensorReports.content;
      this.totalElements = sensorReports.totalElements;
    });
  }

  deleteSensorReport(sensorReport: SensorReport): void {
    if (confirm('Are you sure you want to delete sensor report?')) {
      this.dataService.deleteSensorReport(sensorReport).subscribe(data => {
        this.notificateThisPage([new AppNotification('Deleted sensor report: ' + sensorReport.id, AppNotificationType.SUCCESS)]);
        this.loadPageData();
      });
    }
  }
}
