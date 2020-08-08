import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AppNotification} from "../model/app-notification";
import {DataService} from "../data.service";
import {TokenCheckService} from "../token-check.service";
import {UtilService} from "../util.service";
import {SensorReport} from "../model/sensor-report";
import {SidebarComponent} from "../sidebar/sidebar.component";

@Component({
  selector: 'app-sensor-reports',
  templateUrl: './sensor-reports.component.html',
  styleUrls: ['./sensor-reports.component.scss']
})
export class SensorReportsComponent {
  @ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;
  sensorReportsForDevice: Array<SensorReport> = [];
  notifications: Array<AppNotification> = [];
  totalPages: number;
  pageNumber: number = 1;
  deviceId: number;
  deviceName: string;

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
    this.dataService.getDeviceName(this.deviceId).subscribe(
    	apiResult => this.deviceName = apiResult.data.name
    );
  }

  loadPageForDevice() {
    this.dataService.getSensorReportsByDeviceId(this.deviceId, this.pageNumber - 1).subscribe(
      sensorReports => {
        this.sensorReportsForDevice = sensorReports.content;
        this.totalPages = sensorReports.totalPages;
      }
    );
  }

  loadPage(p) {
    this.pageNumber = p;
    this.loadPageForDevice();
  }

  deleteSensorReport(sensorReport: SensorReport) {
    if (confirm('Are you sure you want to delete sensor report?')) {
      this.dataService.deleteSensorReport(sensorReport).subscribe(
        data => {
          this.loadPageForDevice();
        }
        );
    }
  }

  hasData(): Boolean {
    return typeof this.sensorReportsForDevice !== 'undefined' && this.sensorReportsForDevice.length > 0;
  }

  hasNotifications(): Boolean {
    return this.notifications.length > 0;
  }

}
