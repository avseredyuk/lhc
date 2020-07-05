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
    "/edit-plant-maintenance",  // edit plaint maintenance -- this shoud be part of view url
    "/add-season",
    "/add-crop",
    "/edit-season",
    "/edit-crop"
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

  isSettingsGroup(): Boolean {
    let arr = [
    "/settings", // list
    "/edit-settings", // edit
    "/add-settings" // add
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

  logoutWithConfirmation() {
    if (confirm('Are you sure you want to logout?"')) {
      this.router.navigate(['logout']);
    }
  }
}
