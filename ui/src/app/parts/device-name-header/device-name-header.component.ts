import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../../service/data.service";
import {UtilService} from "../../service/util.service";

@Component({
  selector: 'device-name-header',
  templateUrl: './device-name-header.component.html',
})
export class DeviceNameHeaderComponent implements OnInit {

  @Input() deviceId: number;
  deviceName: string;

  constructor(private dataService: DataService, public utilService: UtilService) {
  }

  ngOnInit(): void {
  	this.dataService.getDeviceName(this.deviceId).subscribe(
      apiResult => {
  	    this.deviceName = this.utilService.formatDeviceName(apiResult.data.name, apiResult.data.privateName);
      }
    );
  }

}
