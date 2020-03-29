import {Component, OnInit} from "@angular/core";
import {Router, NavigationEnd} from "@angular/router";
import {TokenCheckService} from "../token-check.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  currentUrl: string;
  hasToken: Boolean = false;
  canGoBack: Boolean = false;
  goBackCallback: () => any;

  constructor(private router: Router, private tokenCheckService: TokenCheckService) {
    router.events.subscribe((_: NavigationEnd) => this.currentUrl = this.router.url)
  }

  ngOnInit() {
    this.hasToken = !this.tokenCheckService.isExpiredToken();
  }

  isDeviceGroup(): Boolean {
    let arr = [
    "/devices", // list
    "/add-device", // add
    "/devices/", // view
    "/add-plant-maintenance", // add plaint maintenance -- this shoud be part of view url
    "/edit-plant-maintenance"  // edit plaint maintenance -- this shoud be part of view url
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

  setGoBackCallback(callback: () => any) {
    this.canGoBack = true;
    this.goBackCallback = callback;
  }
}
