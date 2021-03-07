import {BaseAuthComponent} from "../base-auth/base-auth.component";
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AppNotification, AppNotificationType} from "../model/app-notification";
import {DataService} from "../service/data.service";
import {TokenCheckService} from "../service/token-check.service";
import {UtilService} from "../service/util.service";
import {SensorReport} from "../model/sensor-report";
import {SidebarComponent} from "../parts/sidebar/sidebar.component";
import {ComponentCommunicationService} from "../service/component-communication.service";

@Component({
  selector: 'app-sensor-reports',
  templateUrl: './sensor-reports.component.html',
  styleUrls: ['./sensor-reports.component.scss']
})
export class SensorReportsComponent extends BaseAuthComponent implements OnInit {
  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  sensorReportsForDevice: Array<SensorReport> = [];
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
    this.dataService.getSensorReportsByDeviceId(this.deviceId, this.pageNumber - 1).subscribe(sensorReports => {
      this.sensorReportsForDevice = sensorReports.content;
      this.totalPages = sensorReports.totalPages;
    });
  }

  loadPage(p: number): void {
    this.pageNumber = p;
    this.loadPageForDevice();
  }

  deleteSensorReport(sensorReport: SensorReport): void {
    if (confirm('Are you sure you want to delete sensor report?')) {
      this.dataService.deleteSensorReport(sensorReport).subscribe(data => {
        this.notificateThisPage([new AppNotification('Deleted sensor report: ' + sensorReport.id, AppNotificationType.SUCCESS)]);
        this.loadPageForDevice();
      });
    }
  }

  hasData(): boolean {
    return typeof this.sensorReportsForDevice !== 'undefined' && this.sensorReportsForDevice.length > 0;
  }
}
