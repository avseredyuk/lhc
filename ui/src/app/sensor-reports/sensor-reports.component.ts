import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AppNotification} from "../model/app-notification";
import {DataService} from "../data.service";
import {TokenCheckService} from "../token-check.service";
import {UtilService} from "../util.service";
import {SensorReport} from "../model/sensor-report";

@Component({
  selector: 'app-sensor-reports',
  templateUrl: './sensor-reports.component.html',
  styleUrls: ['./sensor-reports.component.scss']
})
export class SensorReportsComponent {
  sensorReportsForDevice: Array<SensorReport> = [];
  notifications: Array<AppNotification> = [];
  totalPages: number;
  pageNumber: number = 1;
  deviceId: number;
  deviceName: string;

  constructor(private router: Router, private dataService: DataService, private tokenCheckService: TokenCheckService,
  	private route: ActivatedRoute, private utilService: UtilService) {
  	this.route.params.subscribe(params => this.deviceId = params.id);
  }

  ngOnInit() {
  	if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
      return;
    }
    this.loadPageForDevice();
    this.dataService.getDevice(this.deviceId).subscribe(
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

  hasNotifications(): Boolean {
    return this.notifications.length > 0;
  }

}
