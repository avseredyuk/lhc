import {Component, OnInit} from "@angular/core";
import {Router, NavigationEnd} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  currentUrl: string;

  constructor(private router: Router) {
    router.events.subscribe((_: NavigationEnd) => this.currentUrl = this.router.url)
  }

  ngOnInit() {
  }

  hasToken() {
    return window.localStorage.getItem('token');
  }

  isDeviceGroup(): Boolean {
    let arr = [
    "/devices", // list
    "/add-device", // add
    "/devices/" // view
    ];
    if (this.currentUrl) {
      for (var i = 0, len = arr.length; i < len; i++) {
        if (this.currentUrl.includes(arr[i])) {
          return true;
        }
      }
    }
    return false;
  }

  isMaintenanceGroup(): Boolean {
    let arr = [
    "/maintenance", // list
    "/add-plant-maintenance", // add maintenance
    "/edit-plant-maintenance/" // edit maintenance
    ];
    if (this.currentUrl) {
      for (var i = 0, len = arr.length; i < len; i++) {
        if (this.currentUrl.includes(arr[i])) {
          return true;
        }
      }
    }

    return false;
  }
}
